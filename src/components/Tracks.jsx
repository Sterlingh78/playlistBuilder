export default function Tracks({ searchData }) {
	return (
		<div className='w-full mb-8'>
			{searchData?.tracks ? (
				<h2 className='ml-52 mb-4 text-3xl font-semibold'>Tracks</h2>
			) : (
				''
			)}
			<div className='card mx-auto w-3/4 shadow-2xl bg-base-200'>
				<div className='card-body'>
					{searchData?.tracks?.items?.map((track, i) => {
						return (
							<div
								key={i}
								className='btn btn-secondary w-full flex text-left justify-between'
							>
								<p className='w-1/2'>{track.name}</p>
								<p className=' ml-200'>{track.artists[0].name}</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
