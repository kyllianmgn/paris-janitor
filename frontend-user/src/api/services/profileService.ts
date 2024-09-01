import {UpdateUserInfoReq} from "@/components/profile/PersonalInfoTab";
import {api} from "@/api/config";
import {ChangePasswordReq} from "@/components/profile/SecurityTab";

export const profileService = {
    updateUserInfo: async (updateUserInfoReq: UpdateUserInfoReq) => {
        return await api.patch('users/self-update', {
            json: updateUserInfoReq
        }).then();
    },

    changePassword: async (changePasswordReq: ChangePasswordReq) => {
        return await api.patch('users/self-reset-password', {
            json: changePasswordReq
        }).then();
    }
}
