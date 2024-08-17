import * as React from 'react';

interface VerifyEmailEmailTemplateProps{
    email: string;
    id: string;
    host: string;
    protocol: string;
}

export const VerifyEmailEmailTemplate: React.FC<Readonly<VerifyEmailEmailTemplateProps>> = ({email, id, host, protocol}) => (
    <div>
        <h2>Verify email for <b>{email}</b></h2>
        <p>
            To verify your email, click on this link:
        </p>
        <a href={`${protocol}://${host}/confirmemail?token=${id}`}>
            Click here to verify your email
        </a>
    </div>
);