export default function Artists({ searchData, handleArtistClick }) {
	return (
		<div className='mb-8'>
			{searchData?.artists ? (
				<h2 className='ml-48 mb-2 text-3xl font-semibold'>Artists</h2>
			) : (
				''
			)}
			<div className='flex gap-4 flex-wrap align-middle justify-center'>
				{searchData?.artists?.items.map((artist, i) => {
					return (
						<div
							key={i}
							onClick={() =>
								handleArtistClick(artist.id, artist.name, artist.images[0].url)
							}
							className='card w-96 bg-base-200 shadow-xl'
						>
							<figure className='px-10 pt-10'>
								<img
									src={
										artist.images[0]
											? artist.images[0].url
											: '../src/assets/fallback.png'
									}
									alt='Shoes'
									className='rounded-xl'
								/>
							</figure>
							<div className='card-body items-center text-left'>
								<h2 className='card-title'>{artist.name}</h2>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
