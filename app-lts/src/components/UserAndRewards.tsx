import '../App.css';
import RewardsList from "./RewardsList"
import UserProfile from "./UserProfile"

const UserAndRewards = () => {
    return (
        <div className="flex-column flex items-center justify-center h-screen bg-blue-200">
            <UserProfile/>
            <RewardsList/>
        </div>
    )
}

export default UserAndRewards;