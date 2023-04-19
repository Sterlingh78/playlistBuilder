import { useState } from 'react';
import SearchBar from './SearchBar';
import EditModal from './EditModal';
import Albums from './Albums';
import Artists from './Artists';
import Tracks from './Tracks';

export default function Details({
	currentPlaylist,
	handlePlaylist,
	handleBackArrow,
}) {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [searchData, setSearchData] = useState(null);
	const handleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	const passSearchData = (data) => {
		setSearchData(data);
	};
	const clearSearch = () => {
		setSearchData(null);
	};
	return (
		<div>
			<EditModal
				currentPlaylist={currentPlaylist}
				handlePlaylist={handlePlaylist}
			/>
			<div className='drawer'>
				<input
					checked={drawerOpen}
					readOnly
					id='my-drawer'
					type='checkbox'
					className='drawer-toggle'
				/>
				<div className='drawer-content'>
					<SearchBar
						handleDrawer={handleDrawer}
						currentPlaylist={currentPlaylist}
						passSearchData={passSearchData}
						clearSearch={clearSearch}
					/>
					{searchData !== null ? (
						<div>
							<Tracks searchData={searchData} />
							<Artists searchData={searchData} />
							<Albums searchData={searchData} />
						</div>
					) : (
						''
					)}
				</div>
				<div className='drawer-side'>
					<label
						onClick={handleDrawer}
						htmlFor='my-drawer'
						className='drawer-overlay'
					></label>
					<ul className='menu p-4 w-80 bg-base-100 text-base-content'>
						<div>
							<button
								onClick={handleBackArrow}
								className='btn btn-circle btn-outline mb-4'
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									width='24'
									height='24'
									viewBox='0 0 24 24'
									fill='none'
									stroke='#000000'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								>
									<path d='M19 12H6M12 5l-7 7 7 7' />
								</svg>
							</button>

							<h1 className='ml-2 text-xl my-auto font-bold'>
								{currentPlaylist.name}
							</h1>
							<p className='mb-4'>{currentPlaylist.description}</p>
							<label
								htmlFor='my-modal'
								className=' btn btn-sm btn-primary mb-6'
							>
								Edit
							</label>
						</div>
						{currentPlaylist.tracks.map((trackObj, i) => {
							return (
								<li key={i}>
									<a>{trackObj?.track?.name}</a>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}
