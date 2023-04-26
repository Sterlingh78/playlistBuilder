export default function Albums({ searchData, handleAlbumClick }) {
	return (
		<div className='mb-8'>
			{searchData?.albums ? (
				<h2 className='ml-48 mb-2 text-3xl font-semibold'>Albums</h2>
			) : (
				''
			)}
			<div className='flex gap-4 flex-wrap align-middle justify-center'>
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
							className='card w-96 bg-base-200 shadow-xl cursor-pointer hover:bg-base-100'
						>
							<figure className='px-10 pt-10'>
								<img
									src={album.images[0].url}
									alt='Shoes'
									className='rounded-xl'
								/>
							</figure>
							<div className='card-body items-center text-left'>
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
