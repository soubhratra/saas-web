import * as React from 'react';

interface ResetPasswordTemplateProps{
    email: string;
    id: string;
    host: string;
    protocol: string;
}

export const ResetPasswordTemplate: React.FC<Readonly<ResetPasswordTemplateProps>> = ({email, id, host, protocol}) => (
    <div>
        <h2>Reset your password for <b>{email}</b></h2>
        <p>
            To reset your password, click on this link:
        </p>
        <a href={`${protocol}://${host}/login/resetpassword?token=${id}`}>
            Click here to reset your password
        </a>
    </div>
);