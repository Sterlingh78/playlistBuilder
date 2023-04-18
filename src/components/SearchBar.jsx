import { useState, useRef } from 'react';
export default function SearchBar({}) {
	const [params, setParams] = useState(null);
	const searchRef = useRef(null);
	const addParams = (param) => {
		const cleanParams = params.filter((item) => item !== param);
		setParams([...cleanParams, param]);
	};
	const handleSearch = async () => {
		const arr = ['artist', 'album', 'track', 'audiobook'];
		const body = new URLSearchParams({
			q: 'pink floyd',
			type: arr,
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
			console.log('search test', json);
		} catch (err) {
			console.log(err);
		}
	};
	const handleReturn = (e) => {
		console.log('code test', e.keyCode);
	};
	const handleSearchClick = () => {
		console.log('fired');
		searchRef.current.focus();
	};
	return (
		<div className='navbar bg-base-100'>
			<div className='mx-auto flex flex-col'>
				<div>
					<a className='btn btn-ghost normal-case text-xl'>daisyUI</a>
				</div>

				<input
					ref={searchRef}
					onClick={handleSearchClick}
					tabIndex={0}
					onKeyDown={(e) => handleReturn(e)}
					type='text'
					placeholder='Search'
					className='input input-bordered input-sm w-full'
				/>

				<div className='mt-2 gap-2 flex flex-row'>
					<button className='btn btn-primary btn-sm'>Artist</button>
					<button className='btn btn-primary btn-sm'>Album</button>
					<button className='btn btn-primary btn-sm'>Song</button>
					<button className='btn btn-primary btn-sm'>Audiobook</button>
				</div>
			</div>
		</div>
	);
}
