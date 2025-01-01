const Database = require("../utils/db.js");

class ParameterModel {
  constructor() {
    this.collectionRef = Database.firestore().collection("parameters");
  }

  async addParameter(parameter) {
    try {
      const docRef = await this.collectionRef.add(parameter);
      return docRef.id;
    } catch (error) {
      throw new Error("Error adding parameter: " + error.message);
    }
  }

  async updateParameter(id, newData) {
    try {
      const doc = await this.collectionRef.doc(id).get();

      if (!doc.exists) {
        throw new Error("Document not found");
      }

      const currentData = doc.data();
      const updatedAt = currentData.updatedAt?.toMillis();
      const lastReadTime = newData.lastReadTime
        ? Date.parse(newData.lastReadTime)
        : 0;

      if (updatedAt && lastReadTime < updatedAt) {
        throw new Error(
          "lastReadTime is older than updatedAt. Update aborted."
        );
      }
      delete newData.lastReadTime;
      await this.collectionRef.doc(id).update({
        ...newData,
        updatedAt: new Date(),
      });
    } catch (error) {
      throw new Error("Error updating parameter: " + error.message);
    }
  }

  async deleteParameter(id) {
    try {
      await this.collectionRef.doc(id).delete();
    } catch (error) {
      throw new Error("Error deleting parameter: " + error.message);
    }
  }

  async getParameters() {
    try {
      const snapshot = await this.collectionRef.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      throw new Error("Error fetching parameters: " + error.message);
    }
  }
}

module.exports = ParameterModel;
