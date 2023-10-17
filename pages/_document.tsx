import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
			<Html lang='en'>
				<Head>
					<link rel='shortcut icon' href='/favicon.ico' />

					<link rel='preconnect' href='https://fonts.googleapis.com' />
					<link
						rel='preconnect'
						href='https://fonts.gstatic.com'
						crossOrigin=''
					/>
					<link
						href='https://fonts.googleapis.com/css2?family=Inter:wght@100;300;400;500;600;700&display=swap'
						rel='stylesheet'
					/>
					<script
						defer
						data-domain='nelsonfr.dev'
						src='https://plausible.io/js/script.js'
					></script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
}