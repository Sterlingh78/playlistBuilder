import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
	const [user, setUser] = useState(null);
	const [playlists, setPlaylists] = useState(null);
	const [currentPlaylist, setCurrentPlaylist] = useState(null);
	useEffect(() => {
		const args = new URLSearchParams(window.location.search);
		const code = args.get('code');
		if (code) {
			const redirectUri = localStorage.getItem('redirectUri');
			const clientId = localStorage.getItem('clientId');
			const codeVerifier = localStorage.getItem('code-verifier');

			//console.log('codeverifier', codeVerifier);

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
					/*console.log(
						'Access Token Generated',
						localStorage.getItem('access-token')
					);*/
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
				setUser(data);
				getPlaylists(data);

				window.history.replaceState({}, document.title, '/');
			}
			const getPlaylists = async (user) => {
				const response = await fetch(
					`https://api.spotify.com/v1/users/${user.id}/playlists`,
					{
						headers: {
							Authorization: 'Bearer ' + localStorage.getItem('access-token'),
						},
					}
				);
				const data = await response.json();
				console.log('playlist test', data);
				const ownedPlayLists = data.items.filter(
					(playlist) => playlist.owner.display_name === user.display_name
				);
				setPlaylists(ownedPlayLists);
			};
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
			//console.log('code verified:', localStorage.getItem('code-verifier'));

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
	const fetchPlaylist = async (i) => {
		const response = await fetch(
			`https://api.spotify.com/v1/playlists/${playlists[i].id}`,
			{
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access-token'),
				},
			}
		);
		const data = await response.json();
		return data;
	};
	let itemsArr = [];
	const fetchTracks = async (link) => {
		const response = await fetch(`${link}`, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access-token'),
			},
		});
		const data = await response.json();
		itemsArr = [...itemsArr, ...data.items];
		if (data.next !== null) {
			return fetchTracks(data.next);
		} else {
			console.log('made array', itemsArr);
			return itemsArr;
		}
	};
	const handlePlaylist = async (i) => {
		const data = await fetchPlaylist(i);
		console.log('promise test', data);
		const tracks = await fetchTracks(data.tracks.href);
		console.log('123234', tracks);
		setCurrentPlaylist({
			name: data.name,
			description: data.description,
			followers: data.followers,
			image: data.images[0],
			tracks: [...tracks],
		});

		//fetchTracks(data.tracks.href);

		/*const tracks = fetchTracks(data.tracks.href)
		setCurrentPlaylist({
			name: data.name,
			description: data.description,
			followers: data.followers,
			image: data.images[0],
			tracks: [...tracks]
		})
		if (data.tracks.next !== null) {
			const tracks = fetchTracks(data.tracks.next)
		}*/
	};
	console.log('playlist test', currentPlaylist);
	return (
		<div>
			{playlists ? (
				<div className='hero min-h-screen bg-base-200'>
					<div className='hero-content flex-col'>
						<div className='text-center'>
							<h1 className='text-5xl font-bold'>
								Welcome {user.display_name}!
							</h1>
							<p className='py-6'>Select a playlist below to view or edit.</p>
						</div>
						<div className='card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100'>
							<div className='card-body'>
								{playlists.map((playlist, i) => {
									return (
										<button
											key={i}
											onClick={() => handlePlaylist(i)}
											className='btn btn-secondary'
										>
											{playlist.name}
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			) : (
				<button onClick={handleLogIn}>Spotify Login</button>
			)}
		</div>
	);
}

export default App;
