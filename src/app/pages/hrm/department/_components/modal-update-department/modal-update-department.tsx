import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation, useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { departmentQueryApi } from '~/app/apis/department/query/department.query.api'
import { UpdateDepartmentRequestType } from '~/app/types/department/request/department.type'
import { departmentCommandApi } from '~/app/apis/department/command/department.command.api'
import Input from '~/app/components/input-component'
import { yupResolver } from '@hookform/resolvers/yup'
import { departmentSchema } from '~/app/schemas/department.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useEffect, useRef } from 'react'
import { queryClient } from '~/app/query-client'
import ModalCommon from '~/app/components/modal-common-component'
import { Form } from 'reactstrap'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'

interface ModalUpdateDepartmentProps {
    modal: boolean
    toggle: () => void
    id: number
}

export default function ModalUpdateDepartment({ modal, toggle, id }: ModalUpdateDepartmentProps) {
    const { getLangKey } = useLang()
    const { messageSuccess } = useToastMessageAsync()

    const { data: department } = useQuery({
        queryKey: [TANSTACK_KEY.DEPARTMENT_ONE, id],
        queryFn: () => departmentQueryApi.getDepartmentById(id),
        enabled: !!id
    })

    const {
        mutate,
        isPending: mutatePending,
        isError: mutateIsError,
        error: mutateError
    } = useMutation({
        mutationFn: ({ id, body }: { id: number; body: UpdateDepartmentRequestType }) => departmentCommandApi.updateDepartment(id, body)
    })

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UpdateDepartmentRequestType>({
        resolver: yupResolver(departmentSchema),
        defaultValues: {
            id: 0,
            departmentName: ''
        }
    })

    useEffect(() => {
        if (department) {
            reset(department)
        }
    }, [department, reset])

    const onSubmit: SubmitHandler<UpdateDepartmentRequestType> = (body) => {
        mutate(
            { id, body },
            {
                onSuccess: () => {
                    queryClient.refetchQueries({ queryKey: [TANSTACK_KEY.DEPARTMENT_ALL] })
                    queryClient.invalidateQueries({ queryKey: [TANSTACK_KEY.DEPARTMENT_ONE, id] })
                    toggle()
                    messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_UPDATE_SUCCESSFULLY))
                    reset()
                }
            }
        )
    }

    const formRef = useRef<HTMLFormElement>(null)
    useKeydownForm(formRef)

    return (
        <ModalCommon
            modal={modal}
            onClose={() => toggle()}
            title={getLangKey(CONFIG_LANG_KEY.PAGE_DEPARTMENT_UPDATE_DEPARTMENT)}
            onSubmit={handleSubmit(onSubmit)}
            disabled={mutatePending}
        >
            {mutateIsError && <span className={'titleError'}>{getLangKey(mutateError.message)}</span>}
            <Form onSubmit={handleSubmit(onSubmit)} innerRef={formRef}>
                <Input
                    label={getLangKey(CONFIG_LANG_KEY.PAGE_DEPARTMENT_TITLE_INPUT_DEPARTMENT)}
                    placeholder={getLangKey(CONFIG_LANG_KEY.PAGE_DEPARTMENT_PLACEHOLDER_DEPARTMENT)}
                    control={control}
                    name='departmentName'
                    errors={errors}
                />
            </Form>
        </ModalCommon>
    )
}