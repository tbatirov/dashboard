import type { Dataset, Dashlets } from '@/types';
import FormData from 'form-data';
import axios from 'axios';

class Dashboard {
    private tokenType = import.meta.env.VITE_TOKEN_TYPE;
    private token = import.meta.env.VITE_TOKEN;

    private base64ToJson = (data: string): Object | null => {
        try {
            const binaryString = atob(data);
            const byteArray = Uint8Array.from(binaryString, char => char.charCodeAt(0));
            const jsonString = new TextDecoder().decode(byteArray);
            return JSON.parse(jsonString);
        } catch (error) {
            console.error(error);
            return null;
        }
    };


    public async getDataset(): Promise<any> {
        const url = `https://e-zcargo.tekled.uz/public/csv?search=INP_STAGE_STATUS!=all`;
        try {
            const response = await axios.get(url, {
                headers: {'Accept': 'application/json'},
            });
            if (response.status < 199 || response.status > 299) console.error(response);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    public async getDashlets(id: string): Promise<Dashlets | null> {
        try {
            const response = await axios.get(`https://pmi.gov.uz/api/v3/trackors/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `${this.tokenType} ${this.token}`,
                },
                params: {
                    fields: 'DASH_DASHLETS_JSON',
                },
            });
            if (response.status < 200 || response.status > 299) return null;
            if (!response.data['DASH_DASHLETS_JSON']) return null;
            const data = this.base64ToJson(response.data['DASH_DASHLETS_JSON'].data);
            return data as (Dashlets | null);
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    public async saveDashlets(id: string, dashlets: Dashlets): Promise<Boolean> {
        try {
            const form = new FormData();
            const jsonBlob = new Blob([JSON.stringify(dashlets, null, 2)], { type: 'application/json' });
            form.append('file', jsonBlob, 'dashlets.json');
            const response = await axios.post(
              `https://pmi.gov.uz/api/v3/trackor/${id}/file/DASH_DASHLETS_JSON`,
              form,
              {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                    'Authorization': `${this.tokenType} ${this.token}`,
                },
                params: {
                    'file_name': 'dashlets.json'
                },
              }
            );
            if (response.status < 200 || response.status > 299) return false;
            console.log(response.data);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };
};

export const DashboardApi = new Dashboard();