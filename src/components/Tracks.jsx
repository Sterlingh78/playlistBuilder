export default function Tracks({ searchData, timeConvert, addTrack, alone }) {
	let newArr;
	let selectedArr;
	searchData?.tracks ? (newArr = searchData.tracks.items.slice(0, 5)) : '';
	selectedArr = alone ? searchData.tracks.items : newArr;
	return (
		<div>
			{searchData?.tracks ? (
				<div className={`mt-8 ${alone ? 'mb-8' : 'mb-1'} ml-1  mr-8`}>
					<div
						className={`card mx-auto ${
							alone ? 'w-full' : 'w-full'
						} bg-base-200`}
					>
						<div className='card-body'>
							<ul className='menu gap-2'>
								{selectedArr.map((track, i) => {
									return (
										<li
											key={i}
											className='bg-base-100 rounded-md'
											onClick={() => addTrack(track.uri)}
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
				</div>
			) : (
				''
			)}
		</div>
	);
}
