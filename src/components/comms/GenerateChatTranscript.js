import React from 'react';
import moment from 'moment';

export default function GenerateChatTranscript ({
    user,
    chatParticipant,
    messagesArray
}) {
    return (
        <div dangerouslySetInnerHTML={{ __html: `
            <!DOCTYPE html>
            <html>
                <head>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
                </head>
                <h4>${user.displayName} and ${chatParticipant.displayName} at ${moment().local().format('MM/DD/YYYY HH:mm:ss')}</h4>
                <h4>This is a transcript of your latest chat.</h4>
                <table class="table table-striped">
                    <thead></thead>
                    <tbody>
                        ${
                            messagesArray.map((m) => (
                                `<tr>
                                    <td>${m.senderDisplayName} at ${moment(m.createdOn).format('MM/DD/YYYY HH:mm:ss')}: ${m.content.message}</td>
                                </tr>`
                            )).join(' ')
                        }
                    </tbody>
                </table>
                <style>
                    * {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    }

                    tbody > tr:nth-child(odd)>tH {
                        background-color: #add8e6 !important;
                    }

                    tbody > tr:nth-child(odd)>td {
                        background-color: #add8e6 !important;
                    }
                </style>
            </html>
        ` }}>
        </div>
    )
}

