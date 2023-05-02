import { useState, useRef, forwardRef } from 'react';
const SearchBar = forwardRef(function SearchBar(props, ref) {
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
	const handleSearch = async (e) => {
		const allArr = ['artist', 'track', 'album', 'audiobook'];
		if (e.keyCode === 13) {
			const body = new URLSearchParams({
				q: searchRef.current.value,
				type: params.length > 0 ? params : allArr,
				market: 'ES',
				limit: 10,
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
				props.passSearchData(json);
				console.log('search data', json);
			} catch (err) {
				console.log(err);
			}
		}
	};
	return (
		<div
			ref={ref}
			className='navbar bg-base-100 mb-16'
		>
			<div className='mx-auto flex flex-col items-stretch w-1/2'>
				<div className='relative'>
					<input
						ref={searchRef}
						onKeyDown={(e) => handleSearch(e)}
						type='text'
						placeholder='Search'
						className='input input-bordered w-full'
					/>
					<button
						onClick={() => {
							props.clearSearch();
							searchRef.current.value = '';
						}}
						type='button'
						className=' absolute right-0 top-0 h-full pr-1'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='17'
							height='17'
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							strokeLinecap='round'
							strokeLinejoin='round'
						>
							<line
								x1='18'
								y1='6'
								x2='6'
								y2='18'
							></line>
							<line
								x1='6'
								y1='6'
								x2='18'
								y2='18'
							></line>
						</svg>
					</button>
				</div>

				<div className='mt-2 gap-4 flex justify-center'>
					<div className='flex'>
						<span className='font-bold mr-1'>ARTIST</span>
						<input
							type='checkbox'
							checked={artistChecked}
							onChange={() => {
								setArtistChecked(!artistChecked);
								addParams('artist');
							}}
							className='my-auto w-[1.2rem] h-[1.2rem] checkbox checkbox-primary'
						/>
					</div>
					<div className='flex'>
						<span className='font-bold mr-1'>ALBUM</span>
						<input
							type='checkbox'
							checked={albumChecked}
							onChange={() => {
								setAlbumChecked(!albumChecked);
								addParams('album');
							}}
							className='my-auto w-[1.2rem] h-[1.2rem] checkbox checkbox-primary'
						/>
					</div>
					<div className='flex'>
						<span className='font-bold mr-1'>TRACK</span>
						<input
							type='checkbox'
							checked={trackChecked}
							onChange={() => {
								setTrackChecked(!trackChecked);
								addParams('track');
							}}
							className='my-auto w-[1.2rem] h-[1.2rem] checkbox checkbox-primary'
						/>
					</div>
				</div>
			</div>
		</div>
	);
});
export default SearchBar;
