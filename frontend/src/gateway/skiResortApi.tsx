import axios from "axios";

interface SkiResort {
  region: string;
  state: string;
  name: string;
  latitude: number;
  longitude: number;
}

const BASE_URL = "http://127.0.0.1:5000";
class SkiResortApi {
  async getSkiResorts(): Promise<SkiResort[]> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.get<SkiResort[]>(`${BASE_URL}/ski-resorts`);
      return response.data;
    } catch (error) {
      console.error("Error fetching ski resorts:", error);
      throw error;
    }
  }

  async postSkiResort(resort: SkiResort): Promise<SkiResort> {
    try {
      const response = await axios.post<SkiResort>(
        `${BASE_URL}/ski-resorts`,
        resort
      );

      return response.data;
    } catch (error) {
      console.error("Error posting ski resort:", error);
      throw error;
    }
  }
  async deleteSkiResort(name: string): Promise<void> {
    try {
      await axios.delete<void>(`${BASE_URL}/ski-resorts/${name}`);
    } catch (error) {
      console.error("Error deleting ski resort:", error);
      throw error;
    }
  }
}

export const skiResortApi = new SkiResortApi();
export type { SkiResort };

// Add a default empty resort for form initialization
export const emptySkiResort: SkiResort = {
  region: "",
  state: "",
  name: "",
  latitude: 0,
  longitude: 0,
};
