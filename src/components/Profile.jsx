export default function Profile({ profile }) {
  return (
    <div className="flex items-center mb-6">
      {profile.images && profile.images[0] && (
        <img
          src={profile.images[0].url}
          alt={profile.display_name}
          className="w-16 h-16 rounded-full mr-4"
        />
      )}
      <div>
        <h2 className="text-xl font-semibold">{profile.display_name}</h2>
        <p className="text-slate-400">{profile.followers?.total.toLocaleString()} followers</p>
        {profile.email && <p className="text-slate-400">{profile.email}</p>}
      </div>
    </div>
  );
}