import { fetchApi } from '../api';

export const useBotApi = () => {
  const callApi = async (endpoint, options = {}) => {
    try {
      return await fetchApi(endpoint, options);
    } catch (error) {
      throw error;
    }
  };

  return { callApi };
};
