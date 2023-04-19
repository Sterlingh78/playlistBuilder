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
					{searchData?.tracks?.items?.map((track, i) => {
						return (
							<div
								key={i}
								className='text-left btn btn-primary w-full relative break-words'
							>
								<p className='absolute left-0 ml-2'>{track.name}</p>
								<p className='ml-96'>{track.artists[0].name}</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
