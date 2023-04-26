export default function Tracks({ searchData }) {
	return (
		<div className='w-full mb-8'>
			{searchData?.tracks ? (
				<h2 className='ml-96 pl-4 mb-4 text-3xl font-semibold'>Tracks</h2>
			) : (
				''
			)}
			<div className='card mx-auto w-1/2 bg-base-200'>
				<div className='card-body'>
					<ul className='menu gap-2'>
						{searchData?.tracks?.items?.map((track, i) => {
							return (
								<li
									key={i}
									className='bg-base-100 rounded-md'
								>
									<div className='min-h-[72px] flex justify-between rounded-md'>
										<span className='font-bold'>{track.name}</span>
										<span>{track.artists[0].name}</span>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</div>
	);
}
