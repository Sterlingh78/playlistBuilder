export default function Artists({ searchData, handleArtistClick, alone }) {
	const newArr = searchData?.artists?.items.filter(
		(artist, i) => artist.images[0] !== undefined
	);
	return (
		<ul
			className={`menu gap-2 bg-base-200 p-8 rounded-2xl ${
				alone ? 'w-1/2 mx-auto mt-8' : 'ml-8 mb-8 mt-8 mr-1'
			}`}
		>
			{newArr.map((artist, i) => {
				return (
					<li
						key={i}
						className='bg-base-100 rounded-md'
						onClick={() =>
							handleArtistClick(artist.id, artist.name, artist.images[0].url)
						}
					>
						<div className=' flex rounded-md'>
							<div className='avatar'>
								<div className='w-24 rounded'>
									<img
										src={
											artist.images[0]
												? artist.images[0].url
												: '../public/fallback.png'
										}
									/>
								</div>
							</div>
							<span className='ml-8 font-bold text-xl'>{artist.name}</span>
						</div>
					</li>
				);
			})}
		</ul>
	);
}
