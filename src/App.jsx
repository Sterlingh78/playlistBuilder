import { useState, useEffect } from 'react';
import PlaylistList from './components/PlaylistList';
import Details from './components/Details';
import Navbar from './components/Navbar';
//import './App.css';

function App() {
	const [user, setUser] = useState(null);
	const [ownedPlaylists, setOwnedPlaylists] = useState(null);
	const [currentPlaylist, setCurrentPlaylist] = useState(null);
	const [currentState, setCurrentState] = useState('login');
	const getPlaylists = async (user) => {
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
	};
	const handleHomeClick = () => {
		setCurrentState('playlists');
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
		const redirectUri = 'https://incandescent-kataifi-e16b89.netlify.app/';
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
		const response = await fetch(url, {
			headers: {
				Authorization: 'Bearer ' + localStorage.getItem('access-token'),
			},
		});
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
					<button
						onClick={handleLogIn}
						className='btn btn-primary'
					>
						Spotify Log In
					</button>
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
				user={user}
				currentPlaylist={currentPlaylist}
				handlePlaylist={handlePlaylist}
			/>
		);
	}
	console.log('Playlist State Populated', currentPlaylist);
	console.log('user info', user);
	return (
		<div>
			{currentState !== 'login' ? (
				<Navbar
					handleHomeClick={handleHomeClick}
					user={user}
				/>
			) : (
				''
			)}
			{content}
		</div>
	);
}

export default App;
