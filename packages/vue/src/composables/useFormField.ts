import { inject, provide, type InjectionKey, type Ref } from 'vue';

export type FormFieldStatus = 'error' | 'success' | 'information';

/** FormField가 하위 폼 컨트롤(Input, Textarea, Select…)에 제공하는 연결 정보 */
export interface FormFieldContext {
  /** 컨트롤의 id. label[for]와 연결된다 */
  id: Ref<string>;
  /** 힌트·상태 메시지 요소의 id 목록 (aria-describedby용) */
  describedBy: Ref<string | undefined>;
  status: Ref<FormFieldStatus | undefined>;
  required: Ref<boolean>;
  disabled: Ref<boolean>;
  /** 컨트롤 옆에 아이콘 버튼(.btn-ico-wrap)이 있음을 FormField에 알린다 */
  setIconWrap: (value: boolean, options?: { deletable?: boolean }) => void;
}

export const FORM_FIELD_KEY: InjectionKey<FormFieldContext> =
  Symbol('hanui-form-field');

export const provideFormField = (ctx: FormFieldContext) =>
  provide(FORM_FIELD_KEY, ctx);

/** FormField 안에 있으면 컨텍스트를, 아니면 undefined를 돌려준다 */
export const useFormField = () => inject(FORM_FIELD_KEY, undefined);
