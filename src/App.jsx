import { useState, useEffect } from 'react';
import PlaylistList from './components/PlaylistList';
import Details from './components/Details';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
//import './App.css';

function App() {
	const [user, setUser] = useState(null);
	const [ownedPlaylists, setOwnedPlaylists] = useState(null);
	const [currentPlaylist, setCurrentPlaylist] = useState(null);
	const [currentState, setCurrentState] = useState('login');
	const [theme, setTheme] = useState(localStorage.getItem('theme'));
	const getPlaylists = async (user) => {
		try {
			const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access-token'),
				},
			});
			const data = await response.json();
			console.log('playlist test', data);
			const ownedPlayListsData = data.items.filter(
				(playlist) => playlist.owner.display_name === user.display_name
			);
			console.log('owned test', ownedPlayListsData);
			setOwnedPlaylists(ownedPlayListsData);
			setCurrentState('playlists');
		} catch (err) {
			console.log(err);
		}
	};
	const handleHomeClick = () => {
		setCurrentState('playlists');
	};
	const changeTheme = (theme) => {
		localStorage.setItem('theme', theme);
		setTheme(localStorage.getItem('theme'));
	};
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
			console.log('body test', body.toString());

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
				try {
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
				} catch (err) {
					console.log(err);
				}
			}
		}
	}, []);
	const handleLogIn = async () => {
		//localStorage.clear();
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
			let scope =
				'user-read-private user-read-email playlist-read-private playlist-modify-public playlist-modify-private';

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
		let url;
		if (i.length > 2) {
			url = `https://api.spotify.com/v1/playlists/${i}`;
		} else url = `https://api.spotify.com/v1/playlists/${ownedPlaylists[i].id}`;

		try {
			const response = await fetch(url, {
				headers: {
					Authorization: 'Bearer ' + localStorage.getItem('access-token'),
				},
			});
			const data = await response.json();
			return data;
		} catch (err) {
			console.log(err);
		}
	};
	let itemsArr = [];
	const fetchTracks = async (link) => {
		try {
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
		} catch (err) {
			console.log(err);
		}
	};
	const handlePlaylist = async (i) => {
		const data = await fetchPlaylist(i);
		const tracks = await fetchTracks(data.tracks.href);
		setCurrentPlaylist({
			name: data.name,
			id: data.id,
			description: data.description,
			followers: data.followers,
			image: data.images[0],
			tracks: [...tracks],
		});
		setCurrentState('playlistDetails');
	};

	let content;
	if (currentState === 'login') {
		content = (
			<div className='hero min-h-screen'>
				<div className='hero-content'>
					<div className='flex flex-col text-center'>
						<h1 className='mb-4 font-bold text-6xl text-[hsl(var(--p))]'>
							Welcome to Spotify playlistBuilder!
						</h1>
						<h2 className='mb-8 text-2xl'>Login to Spotify below to begin.</h2>
						<button
							onClick={handleLogIn}
							className='btn btn-primary btn-outline w-1/3 mx-auto'
						>
							Spotify Log In
						</button>
					</div>
				</div>
			</div>
		);
	} else if (currentState === 'playlists' && ownedPlaylists) {
		content = (
			<PlaylistList
				getPlaylists={getPlaylists}
				handlePlaylist={handlePlaylist}
				ownedPlaylists={ownedPlaylists}
				user={user}
			/>
		);
	} else if (currentState === 'playlistDetails' && currentPlaylist) {
		content = (
			<Details
				getPlaylists={getPlaylists}
				user={user}
				currentPlaylist={currentPlaylist}
				handlePlaylist={handlePlaylist}
			/>
		);
	}
	console.log('Playlist State Populated', currentPlaylist);
	console.log('user info', user);
	return (
		<div data-theme={theme}>
			{currentState !== 'login' ? (
				<Navbar
					changeTheme={changeTheme}
					theme={theme}
					handleHomeClick={handleHomeClick}
					user={user}
				/>
			) : (
				''
			)}
			{content}
			<Footer />
		</div>
	);
}

export default App;
