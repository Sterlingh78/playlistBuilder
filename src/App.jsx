import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
	const [profile, setProfile] = useState(null);
	useEffect(() => {
		const args = new URLSearchParams(window.location.search);
		const code = args.get('code');
		if (code) {
			const redirectUri = localStorage.getItem('redirectUri');
			const clientId = localStorage.getItem('clientId');
			const codeVerifier = localStorage.getItem('code-verifier');

			console.log('codeverifier', codeVerifier);

			let body = new URLSearchParams({
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: redirectUri,
				client_id: clientId,
				code_verifier: codeVerifier,
			});

			const response = fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: body,
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error('HTTP status ' + response.status);
					}
					return response.json();
				})
				.then((data) => {
					localStorage.setItem('access-token', data.access_token);
					console.log(
						'Access Token Generated',
						localStorage.getItem('access-token')
					);
					getProfile(data.access_token);
				})
				.catch((error) => {
					console.error('Error:', error);
				});

			async function getProfile(accessToken) {
				const response = await fetch('https://api.spotify.com/v1/me', {
					headers: {
						Authorization: 'Bearer ' + accessToken,
					},
				});

				const data = await response.json();
				console.log('profile received:', data);
				setProfile(data);
				window.history.replaceState({}, document.title, '/');
			}
		}
	}, []);

	const handleLogIn = async () => {
		localStorage.clear();
		const generateRandomString = (length) => {
			let text = '';
			let possible =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

			for (let i = 0; i < length; i++) {
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			return text;
		};
		async function generateCodeChallenge(codeVerifier) {
			function base64encode(string) {
				return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
					.replace(/\+/g, '-')
					.replace(/\//g, '_')
					.replace(/=+$/, '');
			}

			const encoder = new TextEncoder();
			const data = encoder.encode(codeVerifier);
			const digest = await window.crypto.subtle.digest('SHA-256', data);

			return base64encode(digest);
		}

		const clientId = 'ad6bc57077394221908d7a4e65f027d4';
		const redirectUri = 'http://localhost:5173/';
		localStorage.setItem('clientId', clientId);
		localStorage.setItem('redirectUri', redirectUri);

		let codeVerifier = generateRandomString(128);

		generateCodeChallenge(codeVerifier).then((codeChallenge) => {
			let state = generateRandomString(16);
			let scope = 'user-read-private user-read-email';

			localStorage.setItem('code-verifier', codeVerifier);
			console.log('code verified:', localStorage.getItem('code-verifier'));

			let args = new URLSearchParams({
				response_type: 'code',
				client_id: clientId,
				scope: scope,
				redirect_uri: redirectUri,
				state: state,
				code_challenge_method: 'S256',
				code_challenge: codeChallenge,
			});

			window.location = 'https://accounts.spotify.com/authorize?' + args;
		});
		if (window.location.search) {
			console.log('redirected');
		}
	};

	return (
		<div>
			{profile === null ? (
				<button onClick={handleLogIn}>Spotify Login</button>
			) : (
				<p>Logged In!</p>
			)}
		</div>
	);
}

export default App;
