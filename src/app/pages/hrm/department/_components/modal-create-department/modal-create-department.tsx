import Input from '~/app/components/input-component'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation } from '@tanstack/react-query'
import { CreateDepartmentRequestType } from '~/app/types/department/request/department.type'
import { departmentCommandApi } from '~/app/apis/department/command/department.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { departmentSchema } from '~/app/schemas/department.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { queryClient } from '~/app/query-client'
import ModalCommon from '~/app/components/modal-common-component'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { Form } from 'reactstrap'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalCreateDepartmentProps {
    modal: boolean
    toggle: () => void
}

export default function ModalCreateDepartment({ modal, toggle }: ModalCreateDepartmentProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()
    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: (body: CreateDepartmentRequestType) => departmentCommandApi.createDepartment(body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<CreateDepartmentRequestType>({
        resolver: yupResolver(departmentSchema),
        defaultValues: {
            departmentName: ''
        }
    })

    const onSubmit: SubmitHandler<CreateDepartmentRequestType> = (data) => {
        mutate(data, {
            onSuccess: () => {
                queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.DEPARTMENT_ALL] })
                toggle()
                messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_CREATE_SUCCESSFULLY))
                reset()
            }
        })
    }

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    return (
        <ModalCommon
            modal={modal}
            onClose={toggle}
            title={getLangKey(CONFIG_LANG_KEY.PAGE_DEPARTMENT_ADD_DEPARTMENT)}
            titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_DEPARTMENT_CREATE_DEPARTMENT)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            <Form innerRef={formRef} onSubmit={handleSubmit(onSubmit)}>
                <div>
                    {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
                    <Input
                        label={getLangKey(CONFIG_LANG_KEY.PAGE_DEPARTMENT_TITLE_INPUT_DEPARTMENT)}
                        placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_DEPARTMENT_PLACEHOLDER_DEPARTMENT)}
                        control={control}
                        name='departmentName'
                        errors={errors}
                    />
                </div>
            </Form>
        </ModalCommon>
    )
}