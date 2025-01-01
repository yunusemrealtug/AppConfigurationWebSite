<template>
  <div>
    <div class="topbar">
      <img src="@/assets/icon.png" alt="Icon" class="topbarIcon" />
      <div class="user-menu" @click="toggleMenu">
        <img src="@/assets/user.png" alt="User" class="user-icon" />
        <span class="menu-icon">▼</span>
      </div>
    </div>
    <div v-if="isMenuOpen" class="dropdown-menu">
      <p @click="logout">Log Out</p>
    </div>
    <div>
      <select id="country-select" class="country-select" v-model="selectedCountry" @change="fetchParameters">
        <option value="standard">Standard</option>
        <option value="US">US</option>
        <option value="TR">TR</option>
        <option value="DE">DE</option>
        <option value="FR">FR</option>
        <option value="GB">GB</option>
        <option value="CA">CA</option>
        <option value="AU">AU</option>
        <option value="JP">JP</option>
        <option value="CN">CN</option>
        <option value="IN">IN</option>
        <option value="BR">BR</option>
        <option value="RU">RU</option>
        <option value="ZA">ZA</option>
      </select>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Parameter Key</th>
          <th style="width: 15%;">Value</th>
          <th style="width: 30%;">Description</th>
          <th style="width: 8%;">Create Date</th>
          <th style="width: 1%;"></th> 
          <th style="width: 1%;"></th> 
        </tr>
      </thead>
      <tbody>
        <tr v-for="parameter in parameters" :key="parameter.id">
          <td data-label="Parameter Key:">{{ parameter.parameterKey }}</td>
          <td data-label="Value:">{{ parameter.value }}</td>
          <td data-label="Description:">{{ parameter.description }}</td>
          <td data-label="Create Date:">{{ formatDate(parameter.createDate) }}</td>
          <div class="button-container">
            <td><button class="edit-button" @click="prepareEdit(parameter)">Edit</button></td>
            <td><button class="delete-button" @click="deleteParameter(parameter.id)">Delete</button></td>
          </div>
        </tr>
        <tr>
          <td>
            <input type="text" class="parameter-input" v-model="newParameter.parameterKey" placeholder="Parameter Key" />
          </td>
          <td>
            <input type="text" class="parameter-input" v-model="newParameter.value" placeholder="Value" />
          </td>
          <td>
            <input type="text" class="description-input" v-model="newParameter.description" placeholder="Description" />
          </td>
          <td></td> 
          <td class="add-button-container">
            <button class="add-button" @click="isEditing ? updateParameter() : addParameter()">
              {{ isEditing ? 'Update' : 'ADD' }}
            </button>
          <button v-if="isEditing" class="delete-button" @click="resetForm">Cancel</button></td>
        </tr>
        <tr></tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import axios from 'axios';
import './HomePage.css';

export default {
  name: 'HomePage',
  data() {
    return {
      isMenuOpen: false,
      parameters: [],
      newParameter: {
        parameterKey: '',
        value: '',
        description: '',
      },
      isEditing: false,
      editingId: null,
      selectedCountry: 'standard', 
      lastReadTime: null, 
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    logout() {
      console.log("User logged out!");
      localStorage.removeItem('idToken');
      this.isMenuOpen = false;
      this.$router.push('/signin'); 
    },
    fetchParameters() {
      console.log('Fetching parameters for country:', this.selectedCountry);
      axios.get(`${process.env.VUE_APP_BACKEND_URL}/parameters`, {
        params: {
          country: this.selectedCountry 
        },
        headers: {
          token: process.env.VUE_APP_API_TOKEN
        }
      })
      .then(response => {
        this.parameters = response.data;
        this.lastReadTime = new Date(); 
        console.log(this.lastReadTime);
      })
      .catch(error => {
        console.error('Error fetching parameters:', error);
      });
    },

    formatDate(timestamp) {
      const seconds = timestamp?._seconds;
      const nanoseconds = timestamp?._nanoseconds;
      const date = new Date(seconds * 1000 + nanoseconds / 1000000);

      if (isNaN(date.getTime())) {
        return '';
      }

      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    },
    addParameter() {
      axios.post(`${process.env.VUE_APP_BACKEND_URL}/parameters`, this.newParameter, {
        headers: {
          Authorization: `${localStorage.getItem('idToken')}`
        }
      })
         .then(() => {
           this.fetchParameters();
           this.resetForm();
         })
         .catch(error => {
           console.error('Error adding parameter:', error);
         });
    },
    prepareEdit(parameter) {
      this.isEditing = true;
      this.editingId = parameter.id;
      this.newParameter = { 
        parameterKey: parameter.parameterKey,
        value: parameter.value,
        description: parameter.description 
      };
    },
    updateParameter() {
      const selectedCountry = document.getElementById("country-select").value;
      const bodyObject = this.newParameter;
      if (selectedCountry !== 'standard') {
        bodyObject[selectedCountry] = bodyObject.value;
        delete bodyObject.value;
      }
      bodyObject.lastReadTime = this.lastReadTime; 
        
      axios.put(`${process.env.VUE_APP_BACKEND_URL}/parameters/${this.editingId}`, bodyObject, {
        headers: {
          Authorization: `${localStorage.getItem('idToken')}`
        }
      })
        .then(() => {
          this.fetchParameters();
          this.resetForm();
        })
        .catch(error => {
          this.resetForm();
          console.error('Error updating parameter:', error);
          alert('Error updating parameter. Try updating again.');
          this.fetchParameters();
        });
    },
    deleteParameter(id) {
      axios.delete(`${process.env.VUE_APP_BACKEND_URL}/parameters/${id}`, {
        headers: {
          Authorization: `${localStorage.getItem('idToken')}`
        }
      })
        .then(() => {
          this.fetchParameters();
        })
        .catch(error => {
          console.error('Error deleting parameter:', error);
        });
    },
    resetForm() {
      this.newParameter = { parameterKey: '', value: '', description: '' };
      this.isEditing = false;
      this.editingId = null;
    },
    checkAuthentication() {
      const idToken = localStorage.getItem('idToken');
      if (!idToken) {
        this.$router.push('/signin'); 
      }
    }
  },
  mounted() {
    this.checkAuthentication(); 
    this.fetchParameters();
  }
}
</script>