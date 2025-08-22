
const UserItem = ({ user }) => {
    return (
        <li key={user.id} style={{ listStyle: 'none', padding: '10px 12px', borderBottom: '1px solid #f2f2f2', display: 'flex', alignItems: 'center', gap: 10 }}>
            {user.avatar ? (
                <img
                    src={user.avatar}
                    alt=""
                    width="32"
                    height="32"
                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', background: '#f3f3f3' }}
                />
            ) : (
                <span style={{ display: 'inline-grid', placeItems: 'center', width: 32, height: 32, borderRadius: '50%', background: '#f3f3f3', fontSize: 12 }}>
                    {user.name.split(' ').slice(0, 2).map(s => s[0]?.toUpperCase() || '').join('')}
                </span>
            )}
            <span>{user.name}</span>
        </li>
    )
}

export default UserItem
