import { AxiosResponse } from 'axios';
import axios from '../axios';
import IMessage from '../interface/message';

export const postBlog = async (data: FormData): Promise<IMessage> => {
	const res: AxiosResponse = await axios.post(
		'http://localhost:5000/api/blog',
		data
	);

	return res.data;
};
