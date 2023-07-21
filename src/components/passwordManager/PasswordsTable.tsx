import { IUserPassword } from "../../globals/interfaces";
import VirtualTable from "../custom/VirtualTable";

interface Props {
    data: Array<IUserPassword>;
    openPasswordForm: (item: IUserPassword) => void;
    enableEdit: boolean;
}

export default function PasswordsTable ({
    data,
    openPasswordForm,
    enableEdit
}: Props) {
    return (
        <VirtualTable
            data={data}
            mapping={[
                {
                    name: 'Name',
                    value: 'name',
                },
                {
                    name: 'Link',
                    icon: true,
                    value: 'fas fa-external-link text-success hover',
                    function: (item: IUserPassword) => item.link && window.open(item.link)
                },
                {
                    name: 'Username',
                    value: 'username',
                    password: true,
                },
                {
                    name: 'Password',
                    value: 'password',
                    password: true,
                },
                {
                    name: 'View',
                    icon: true,
                    value: 'fas fa-edit',
                    function: (item: IUserPassword) =>
                        enableEdit && openPasswordForm(item),
                },
            ]}
            numRows={10}
        />
    );
}