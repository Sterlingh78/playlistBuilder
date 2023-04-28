export default function Navbar({ user, handleHomeClick, changeTheme, theme }) {
	const handleLogout = () => {
		location.reload();
	};
	return (
		<div className='navbar bg-base-100'>
			<div className='flex-1'>
				<a
					onClick={handleHomeClick}
					className='btn btn-ghost normal-case text-xl'
				>
					playlistBuilder
				</a>
			</div>
			<div className='flex-none gap-2'>
				<div className='dropdown dropdown-end flex'>
					<label
						tabIndex={0}
						className='btn btn-ghost rounded-btn'
					>
						{theme ? theme : 'Theme'}
					</label>
					<ul
						tabIndex={0}
						className='menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4'
					>
						<li>
							<a
								onClick={() => {
									changeTheme('dark');
								}}
							>
								dark
							</a>
						</li>
						<li>
							<a
								onClick={() => {
									changeTheme('light');
								}}
							>
								light
							</a>
						</li>
						<li>
							<a
								onClick={() => {
									changeTheme('forest');
								}}
							>
								forest
							</a>
						</li>
						<li>
							<a
								onClick={() => {
									changeTheme('aqua');
								}}
							>
								aqua
							</a>
						</li>
					</ul>
					<label
						tabIndex={0}
						className='btn btn-ghost btn-circle avatar'
					>
						<div className='w-10 rounded-full'>
							<img src={user.images[0].url} />
						</div>
					</label>
				</div>
			</div>
		</div>
	);
}
