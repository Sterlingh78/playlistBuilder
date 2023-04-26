import { useEffect } from 'react';

export default function Album({ albumData }) {
	setTimeout(() => {
		console.log('fired 234234');
		window.scroll(0, 0);
	}, 1000);
	return (
		<div className='hero min-h-screen bg-base-200'>
			<div className='hero-content flex-col w-full'>
				<div className='flex w-full text-center'>
					<div className='flex flex-col items-center text-center h-full my-auto mr-8 break-words'>
						<h1 className='text-6xl mx-auto mb-4'>{albumData.name}</h1>
						<h2 className='text-4xl mx-auto'>{albumData.artist}</h2>
					</div>
					<img
						src={albumData.imageUrl}
						className='max-w-lg rounded-lg'
					/>
				</div>
				<div className='card w-full bg-base-200'>
					<div className='card-body'>
						<ul className='menu gap-2'>
							{albumData?.items?.items?.map((track, i) => {
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
		</div>
	);
}
