import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import { employeeQueryApi } from '~/app/apis/employee/query/employee.query.api'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import { formatDateTimestamp } from '~/app/utils/string.util'
import Image from '~/app/components/image-component'
import Badge from '~/app/components/badge-component'
import styles from './employee-detail.module.scss'
import classNames from 'classnames/bind'

const cx = classNames.bind(styles)

export default function EmployeeDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { getLangKey } = useLang()

    console.log('=== DEBUG EMPLOYEE DETAIL ===')
    console.log('Employee ID from URL:', id)

    // SỬA: Dùng getEmployeeById (giống trang update)
    const { data: employee, isLoading, error } = useQuery({
        queryKey: [TANSTACK_KEY.EMPLOYEE_ONE, id],
        queryFn: () => employeeQueryApi.getEmployeeById(Number(id)),
        enabled: !!id && !isNaN(Number(id)),
        retry: 1,
    })

    console.log('=== QUERY STATE ===')
    console.log('Loading:', isLoading)
    console.log('Error:', error)
    console.log('Employee data:', employee)

    // Hiển thị loading
    if (isLoading) {
        return (
            <div className='container-content'>
                <div className={cx('loading')}>
                    <div>Loading employee data...</div>
                </div>
            </div>
        )
    }

    // Hiển thị lỗi
    if (error) {
        console.log('Error details:', error)
        return (
            <div className='container-content'>
                <div className={cx('error')}>
                    <div className={cx('errorContent')}>
                        <h3>⚠️ Lỗi tải thông tin nhân viên</h3>
                        <p>Không thể tải thông tin nhân viên với ID: <strong>{id}</strong></p>
                        <p>Lỗi: <strong>{error.message || 'ERP365_SERVER_ERROR'}</strong></p>
                        <div className={cx('errorActions')}>
                            <button 
                                className={cx('backButton')}
                                onClick={() => navigate(-1)}
                            >
                                <i className='ri-arrow-left-line'></i>
                                Quay lại danh sách
                            </button>
                            <button 
                                className={cx('retryButton')}
                                onClick={() => window.location.reload()}
                            >
                                <i className='ri-refresh-line'></i>
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Kiểm tra employee tồn tại
    if (!employee) {
        return (
            <div className='container-content'>
                <div className={cx('error')}>
                    <div className={cx('errorContent')}>
                        <h3>❌ Không tìm thấy nhân viên</h3>
                        <p>Không tìm thấy thông tin nhân viên với ID: <strong>{id}</strong></p>
                        <button 
                            className={cx('backButton')}
                            onClick={() => navigate(-1)}
                        >
                            <i className='ri-arrow-left-line'></i>
                            Quay lại danh sách
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Hiển thị thông tin nhân viên
    return (
        <div className='container-content'>
            <div className={cx('employeeDetail')}>
                {/* Header với nút back */}
                <div className={cx('header')}>
                    <button 
                        className={cx('backButton')}
                        onClick={() => navigate(-1)}
                    >
                        <i className='ri-arrow-left-line'></i>
                        {getLangKey(CONFIG_LANG_KEY.ERP365_BACK)}
                    </button>
                </div>

                {/* Thông tin nhân viên */}
                <div className={cx('profileCard')}>
                    <div className={cx('avatarSection')}>
                        <Image 
                            src={employee.empImage} 
                            alt={`${employee.empFirstName} ${employee.empLastName}`}
                            className={cx('avatar')}
                            fallback="/default-avatar.png"
                        />
                        <div className={cx('basicInfo')}>
                            <h1>{employee.empFirstName} {employee.empLastName}</h1>
                            <p className={cx('employeeCode')}>Mã NV: {employee.empCode}</p>
                            <Badge 
                                soft={true} 
                                color={employee.isActived ? 'success' : 'warning'}
                            >
                                {employee.isActived 
                                    ? getLangKey(CONFIG_LANG_KEY.ERP365_ACTIVED)
                                    : getLangKey(CONFIG_LANG_KEY.ERP365_INACTIVED)
                                }
                            </Badge>
                        </div>
                    </div>

                    {/* Thông tin chi tiết */}
                    <div className={cx('detailSections')}>
                        <div className={cx('section')}>
                            <h3>Thông tin cá nhân</h3>
                            <div className={cx('infoGrid')}>
                                <InfoItem 
                                    label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TABLE_HEADER_DATE_OF_BIRTH)}
                                    value={employee.empBirthday 
                                        ? formatDateTimestamp(employee.empBirthday).toLocaleDateString('vi-VN')
                                        : getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)
                                    }
                                />
                                <InfoItem 
                                    label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TABLE_HEADER_GENDER)}
                                    value={employee.empGender === 0 
                                        ? getLangKey(CONFIG_LANG_KEY.ERP365_MALE)
                                        : getLangKey(CONFIG_LANG_KEY.ERP365_FEMALE)
                                    }
                                />
                                <InfoItem 
                                    label={getLangKey(CONFIG_LANG_KEY.PAGE_EMPLOYEE_TABLE_HEADER_TEL)}
                                    value={employee.empTel || getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)}
                                />
                                <InfoItem 
                                    label="Email"
                                    value={employee.empEmail || getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)}
                                />
                                {employee.empPlaceOfBirth && (
                                    <InfoItem 
                                        label="Nơi sinh"
                                        value={employee.empPlaceOfBirth.toString()}
                                    />
                                )}
                            </div>
                        </div>

                        <div className={cx('section')}>
                            <h3>Thông tin công việc</h3>
                            <div className={cx('infoGrid')}>
                                <InfoItem 
                                    label={getLangKey(CONFIG_LANG_KEY.ERP365_POSITION)}
                                    value={employee.empRoleName || getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)}
                                />
                                <InfoItem 
                                    label="Phòng ban"
                                    value={employee.departmentName || getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)}
                                />
                                <InfoItem 
                                    label="Công ty"
                                    value={employee.companyName || getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)}
                                />
                                <InfoItem 
                                    label="Ngày vào làm"
                                    value={employee.empJoinedDate 
                                        ? formatDateTimestamp(employee.empJoinedDate).toLocaleDateString('vi-VN')
                                        : getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)
                                    }
                                />
                            </div>
                        </div>

                        {/* Thêm các section khác nếu có data */}
                        {(employee.empCitizenIdentity || employee.empTaxCode) && (
                            <div className={cx('section')}>
                                <h3>Thông tin pháp lý</h3>
                                <div className={cx('infoGrid')}>
                                    {employee.empCitizenIdentity && (
                                        <InfoItem 
                                            label="CMND/CCCD"
                                            value={employee.empCitizenIdentity}
                                        />
                                    )}
                                    {employee.empTaxCode && (
                                        <InfoItem 
                                            label="Mã số thuế"
                                            value={employee.empTaxCode}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Thông tin địa chỉ */}
                        {employee.ward && (
                            <div className={cx('section')}>
                                <h3>Thông tin địa chỉ</h3>
                                <div className={cx('infoGrid')}>
                                    <InfoItem 
                                        label="Địa chỉ"
                                        value={employee.empPlaceOfResidenceAddress || getLangKey(CONFIG_LANG_KEY.ERP365_EMPTY)}
                                    />
                                    {employee.ward.localWardInfo && (
                                        <InfoItem 
                                            label="Phường/Xã"
                                            value={employee.ward.localWardInfo.name}
                                        />
                                    )}
                                    {employee.ward.localDistrictInfo && (
                                        <InfoItem 
                                            label="Quận/Huyện"
                                            value={employee.ward.localDistrictInfo.name}
                                        />
                                    )}
                                    {employee.ward.localProvinceInfo && (
                                        <InfoItem 
                                            label="Tỉnh/Thành phố"
                                            value={employee.ward.localProvinceInfo.name}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Component con cho các item thông tin
function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className={cx('infoItem')}>
            <label>{label}</label>
            <span>{value}</span>
        </div>
    )
}