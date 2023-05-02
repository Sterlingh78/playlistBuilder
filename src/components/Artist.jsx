export default function Artist({
	artistData,
	timeConvert,
	handleAlbumClick,
	addTrack,
}) {
	return (
		<div className='hero min-h-screen bg-base-100'>
			<div className='hero-content flex-col w-full'>
				<div className='flex text-center'>
					<div className='flex flex-col items-center text-center h-full my-auto mr-8 break-words'>
						<h1 className='text-6xl mx-auto text-[hsl(var(--p))]'>
							{artistData.name}
						</h1>
					</div>
					<img
						src={artistData?.imageUrl}
						className='max-w-lg rounded-lg'
					/>
				</div>
				<div className='card w-full bg-base-200'>
					<div className='card-body'>
						<ul className='menu gap-2'>
							{artistData?.topTracks?.map((track, i) => {
								return (
									<li
										onClick={() => addTrack(track.uri)}
										key={i}
										className='bg-base-100 rounded-md'
									>
										<div className='min-h-[72px] flex justify-between rounded-md'>
											<span className='font-bold'>{track.name}</span>
											<div className='flex justify-between w-1/6'>
												<span>{track.artists[0].name}</span>
												<span>{timeConvert(track.duration_ms)}</span>
											</div>
										</div>
									</li>
								);
							})}
						</ul>
					</div>
				</div>
				<div className='flex gap-4 flex-wrap align-middle justify-center'>
					{artistData?.albums?.map((album, i) => {
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
								className='card w-96 cursor-pointer hover:bg-base-200'
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
									<h3>{album.release_date.substr(0, 4)}</h3>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
