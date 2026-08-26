'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
} from '../card';
import { Input } from '../input';
import { Button } from '../button';
import { Badge } from '../badge';
import { Label } from '../label';
import { Select } from '../select';
import { Modal, ModalTitle, ModalBody, ModalFooter } from '../modal';
import { cn } from '@/lib/utils';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

/** 역할 타입 */
export type UserRole = 'SUPER_ADMIN' | 'EDITOR' | 'VIEWER';

/** 사용자 데이터 */
export interface AdminUserData {
  /** 사용자 ID */
  id: number;
  /** 이름 */
  name: string;
  /** 아이디 (로그인용) */
  username: string;
  /** 역할 */
  role: UserRole;
  /** 최종 로그인 일시 */
  lastLoginAt?: string;
  /** 활성 상태 */
  isActive: boolean;
}

/** 사용자 폼 데이터 (추가/수정) */
export interface UserFormData {
  name: string;
  username: string;
  password?: string;
  role: UserRole;
}

// ============================================================================
// UserManagement Props
// ============================================================================

export interface UserManagementProps {
  /** 사용자 목록 */
  users: AdminUserData[];
  /** 사용자 추가 핸들러 */
  onAdd?: (data: UserFormData) => void;
  /** 사용자 수정 핸들러 */
  onEdit?: (id: number, data: UserFormData) => void;
  /** 사용자 삭제(비활성화) 핸들러 */
  onDelete?: (id: number) => void;
  /** 현재 로그인한 사용자 ID (자기 자신 삭제 방지) */
  currentUserId?: number;
  /** 추가 className */
  className?: string;
}

// ============================================================================
// Helpers
// ============================================================================

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: '최고관리자',
  EDITOR: '편집자',
  VIEWER: '뷰어',
};

const ROLE_OPTIONS = [
  { label: '최고관리자', value: 'SUPER_ADMIN' },
  { label: '편집자', value: 'EDITOR' },
  { label: '뷰어', value: 'VIEWER' },
];

function getRoleBadgeVariant(role: UserRole) {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'primary' as const;
    case 'EDITOR':
      return 'info' as const;
    case 'VIEWER':
      return 'gray' as const;
  }
}

// ============================================================================
// UserManagement Component
// ============================================================================

/**
 * 사용자 관리 블록
 *
 * 관리자 계정을 목록으로 표시하고 추가/수정/삭제 기능을 제공.
 * - 역할 배지 표시 (최고관리자/편집자/뷰어)
 * - 모달 기반 추가/수정 폼
 * - 자기 자신 계정 삭제 방지
 */
export function UserManagement({
  users,
  onAdd,
  onEdit,
  onDelete,
  currentUserId,
  className,
}: UserManagementProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<AdminUserData | null>(
    null
  );
  const [formData, setFormData] = React.useState<UserFormData>({
    name: '',
    username: '',
    password: '',
    role: 'EDITOR',
  });

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', username: '', password: '', role: 'EDITOR' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: '',
      role: user.role,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onEdit?.(editingUser.id, formData);
    } else {
      onAdd?.(formData);
    }
    setIsModalOpen(false);
  };

  const handleFormChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Card variant="outlined" className={cn('w-full', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>계정 관리</CardTitle>
              <CardDescription>
                관리자 계정을 추가하거나 수정합니다.
              </CardDescription>
            </div>
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Plus className="w-4 h-4" />}
              onClick={openAddModal}
            >
              계정 추가
            </Button>
          </div>
        </CardHeader>

        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">사용자 목록</caption>
              <thead>
                <tr className="border-b border-krds-gray-20 bg-krds-gray-5">
                  <th scope="col" className="text-left py-3 px-4 font-medium text-krds-gray-70">
                    이름
                  </th>
                  <th scope="col" className="text-left py-3 px-4 font-medium text-krds-gray-70">
                    아이디
                  </th>
                  <th scope="col" className="text-left py-3 px-4 font-medium text-krds-gray-70">
                    역할
                  </th>
                  <th scope="col" className="text-left py-3 px-4 font-medium text-krds-gray-70">
                    최종 로그인
                  </th>
                  <th scope="col" className="text-right py-3 px-4 font-medium text-krds-gray-70">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-krds-gray-50"
                    >
                      등록된 계정이 없습니다.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className={cn(
                        'border-b border-krds-gray-10 hover:bg-krds-gray-5 transition-colors',
                        !user.isActive && 'opacity-50'
                      )}
                    >
                      <td className="py-3 px-4 font-medium text-krds-gray-90">
                        {user.name}
                      </td>
                      <td className="py-3 px-4 text-krds-gray-70">
                        {user.username}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={getRoleBadgeVariant(user.role)}>
                          {ROLE_LABELS[user.role]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-krds-gray-50">
                        {user.lastLoginAt || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="p-2 rounded-md text-krds-gray-50 hover:text-krds-gray-90 hover:bg-krds-gray-10 transition-colors cursor-pointer border-0 bg-transparent"
                            aria-label={`${user.name} 수정`}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete?.(user.id)}
                            disabled={user.id === currentUserId}
                            className={cn(
                              'p-2 rounded-md transition-colors cursor-pointer border-0 bg-transparent',
                              user.id === currentUserId
                                ? 'text-krds-gray-30 cursor-not-allowed'
                                : 'text-krds-gray-50 hover:text-red-600 hover:bg-red-50'
                            )}
                            aria-label={`${user.name} 삭제`}
                            title={
                              user.id === currentUserId
                                ? '자기 자신은 삭제할 수 없습니다'
                                : undefined
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* 추가/수정 모달 */}
      <Modal open={isModalOpen} onClose={setIsModalOpen}>
        <ModalTitle>{editingUser ? '계정 수정' : '계정 추가'}</ModalTitle>
        <ModalBody>
          <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-name">
                이름 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="user-name"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-username">
                아이디 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="user-username"
                placeholder="아이디를 입력하세요"
                value={formData.username}
                onChange={(e) => handleFormChange('username', e.target.value)}
                disabled={!!editingUser}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-password">
                비밀번호{' '}
                {!editingUser && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="user-password"
                type="password"
                placeholder={
                  editingUser ? '변경 시에만 입력' : '비밀번호를 입력하세요'
                }
                value={formData.password}
                onChange={(e) => handleFormChange('password', e.target.value)}
                required={!editingUser}
              />
            </div>

            <div
              className="space-y-2"
              role="group"
              aria-labelledby="user-role-label"
            >
              <Label id="user-role-label">역할</Label>
              <Select
                options={ROLE_OPTIONS}
                value={formData.role}
                onChange={(value) => handleFormChange('role', value)}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            취소
          </Button>
          <Button
            type="submit"
            form="user-form"
            variant="primary"
            disabled={!formData.name || !formData.username}
          >
            {editingUser ? '수정' : '추가'}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
