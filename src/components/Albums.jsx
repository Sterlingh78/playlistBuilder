export default function Albums({ searchData, handleAlbumClick, alone }) {
	return (
		<div className={` ${alone ? 'mt-8' : 'mt-1 ml-1'} mr-8 mb-8 rounded-2xl`}>
			<div className={`flex gap-2 flex-wrap align-middle justify-center`}>
				{searchData?.albums?.items.map((album, i) => {
					return (
						<div
							onClick={() =>
								handleAlbumClick(
									album.id,
									album.name,
									album.artists[0].name,
									album.images[0].url
								)
							}
							key={i}
							className={`card w-72 cursor-pointer hover:bg-base-200`}
						>
							<figure className='px-10 pt-10'>
								<img
									src={album.images[0].url}
									alt='Shoes'
									className='rounded-xl'
								/>
							</figure>
							<div className='card-body items-center text-center'>
								<h2 className='card-title'>{album.name}</h2>
								<h3>{album.artists[0].name}</h3>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
