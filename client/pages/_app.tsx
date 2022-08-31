import 'antd/dist/antd.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import {
	QueryClientProvider,
	QueryClient,
	Hydrate,
} from '@tanstack/react-query';
import UserAuth from '../utils/UserAuth';

function MyApp({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient());

	const [isSSR, setIsSSR] = useState<boolean>(true);

	useEffect(() => setIsSSR(false), []);

	if (isSSR) return;

	return (
		<QueryClientProvider client={queryClient}>
			<Hydrate state={pageProps.dehydratedState}>
				<UserAuth>
					<Component {...pageProps} />
				</UserAuth>
			</Hydrate>
		</QueryClientProvider>
	);
}

export default MyApp;
