import { useState, useRef } from 'react';
export default function SearchBar({}) {
	const [params, setParams] = useState([]);
	const [artistChecked, setArtistChecked] = useState(false);
	const [albumChecked, setAlbumChecked] = useState(false);
	const [trackChecked, setTrackChecked] = useState(false);
	const [audiobookChecked, setAudiobookChecked] = useState(false);
	const [currentResults, setCurrentResults] = useState(null);
	const searchRef = useRef(null);
	const addParams = (param) => {
		const contained = params.includes(param);

		if (contained === true) {
			const cleanParams = params.filter((item) => item !== param);
			setParams([...cleanParams]);
		} else {
			setParams((prevState) => [...prevState, param]);
		}
	};
	//console.log('params test', params);
	console.log('results test', currentResults);
	const handleSearch = async (e) => {
		const allArr = ['artist', 'track', 'album', 'audiobook'];
		if (e.keyCode === 13) {
			const body = new URLSearchParams({
				q: searchRef.current.value,
				type: params.length > 0 ? params : allArr,
				market: 'ES',
			});
			try {
				const response = await fetch(
					`https://api.spotify.com/v1/search?${body}`,
					{
						headers: {
							Authorization: 'Bearer ' + localStorage.getItem('access-token'),
						},
					}
				);
				const string = await response.text();
				const json = string === '' ? {} : JSON.parse(string);
				setCurrentResults(json);
				//console.log('search test', json);
			} catch (err) {
				console.log(err);
			}
		}
	};
	const handleReturn = (e) => {
		console.log('code test', e.keyCode);
	};
	return (
		<div className='navbar bg-base-100'>
			<div className='mx-auto flex flex-col'>
				<div>
					<a className='btn btn-ghost normal-case text-xl'>daisyUI</a>
				</div>

				<input
					ref={searchRef}
					onKeyDown={(e) => handleSearch(e)}
					type='text'
					placeholder='Search'
					className='input input-bordered input-sm w-full'
				/>

				<div className='mt-2 gap-2 flex flex-row'>
					<div className='flex'>
						<span className='label-text mr-1'>Artist</span>
						<input
							type='checkbox'
							checked={artistChecked}
							onChange={() => {
								setArtistChecked(!artistChecked);
								addParams('artist');
							}}
							className='my-auto checkbox checkbox-accent'
						/>
					</div>
					<div className='flex'>
						<span className='label-text mr-1'>Album</span>
						<input
							type='checkbox'
							checked={albumChecked}
							onChange={() => {
								setAlbumChecked(!albumChecked);
								addParams('album');
							}}
							className='my-auto checkbox checkbox-accent'
						/>
					</div>
					<div className='flex'>
						<span className='label-text mr-1'>Track</span>
						<input
							type='checkbox'
							checked={trackChecked}
							onChange={() => {
								setTrackChecked(!trackChecked);
								addParams('track');
							}}
							className='my-auto checkbox checkbox-accent'
						/>
					</div>
					<div className='flex'>
						<span className='label-text mr-1'>Audiobook</span>
						<input
							type='checkbox'
							checked={audiobookChecked}
							onChange={() => {
								setAudiobookChecked(!audiobookChecked);
								addParams('audiobook');
							}}
							className='my-auto checkbox checkbox-accent'
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
