export default function Navbar({ user, handleHomeClick }) {
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
				<div className='dropdown dropdown-end'>
					<label
						tabIndex={0}
						className='btn btn-ghost btn-circle avatar'
					>
						<div className='w-10 rounded-full'>
							<img src={user.images[0].url} />
						</div>
					</label>
					<ul
						tabIndex={0}
						className='mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52'
					>
						<li>
							<a>Theme</a>
						</li>
						<li onClick={handleLogout}>
							<a>Logout</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}
