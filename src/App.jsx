import { useState, useEffect } from 'react';
//import './App.css';

function App() {
	const [user, setUser] = useState(null);
	const [ownedPlaylists, setOwnedPlaylists] = useState(null);
	const [currentPlaylist, setCurrentPlaylist] = useState(null);
	const [currentState, setCurrentState] = useState('login');
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
				setOwnedPlaylists(ownedPlayLists);
				setCurrentState('playlists');
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
			`https://api.spotify.com/v1/playlists/${ownedPlaylists[i].id}`,
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
			return itemsArr;
		}
	};
	const handlePlaylist = async (i) => {
		const data = await fetchPlaylist(i);
		const tracks = await fetchTracks(data.tracks.href);
		setCurrentPlaylist({
			name: data.name,
			description: data.description,
			followers: data.followers,
			image: data.images[0],
			tracks: [...tracks],
		});
	};

	let content;
	if (currentState === 'login') {
		content = <button onClick={handleLogIn}>Spotify Login</button>;
	} else if (currentState === 'playlists' && ownedPlaylists) {
		content = (
			<div className='hero min-h-screen bg-base-200'>
				<div className='hero-content flex-col'>
					<div className='text-center'>
						<h1 className='text-5xl font-bold'>Welcome {user.display_name}!</h1>
						<p className='py-6'>Select a playlist below to view or edit.</p>
					</div>
					<div className='card flex-shrink-0 w-full max-w-md shadow-2xl bg-base-100'>
						<div className='card-body'>
							{ownedPlaylists.map((playlist, i) => {
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
		);
	} else if (currentState === 'playlistDetails') {
		content = (
			<div className='drawer drawer-mobile'>
				<input
					id='my-drawer-2'
					type='checkbox'
					className='drawer-toggle'
				/>
				<div className='drawer-content flex flex-col items-center justify-center'>
					<label
						htmlFor='my-drawer-2'
						className='btn btn-primary drawer-button lg:hidden'
					>
						Open drawer
					</label>
				</div>
				<div className='drawer-side'>
					<label
						htmlFor='my-drawer-2'
						className='drawer-overlay'
					></label>
					<ul className='menu p-4 w-80 bg-base-100 text-base-content'>
						<li>
							<a>Sidebar Item 1</a>
						</li>
						<li>
							<a>Sidebar Item 2</a>
						</li>
					</ul>
				</div>
			</div>
		);
	}
	console.log('Playlist State Populated', currentPlaylist);
	return content;
}

export default App;
