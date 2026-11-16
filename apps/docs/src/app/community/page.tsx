import { Stack, Body } from '@hanui/react';
import { PageSection, Heading } from '@/components/content';

export default function CommunityPage() {
  return (
    <>
      <PageSection>
        <Heading
          level="h1"
          title="Community"
          description="HANUI는 오픈소스 프로젝트입니다. 버그 리포트, 기능 제안, 질문 등은 GitHub을 통해 참여해주세요."
        />

        <Stack gap="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <a
              href="https://github.com/hanui-o/hanui/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 border border-krds-gray-20 rounded-lg hover:border-krds-gray-30 hover:bg-krds-gray-5 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-krds-gray-10 flex items-center justify-center group-hover:bg-krds-gray-20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-krds-gray-70"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="mt-1 mb-3 text-krds-gray-95 font-bold text-lg">
                  GitHub Issues
                </h2>
                <Body size="sm" className="text-krds-gray-70">
                  버그 리포트, 기능 요청, 질문을 남겨주세요
                </Body>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-krds-gray-50 group-hover:text-krds-gray-70 transition-colors mt-1"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>

            <a
              href="https://github.com/hanui-o/hanui/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 border border-krds-gray-20 rounded-lg hover:border-krds-gray-30 hover:bg-krds-gray-5 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-krds-gray-10 flex items-center justify-center group-hover:bg-krds-gray-20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-krds-gray-70"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="mt-1 mb-3 text-krds-gray-95 font-bold text-lg">
                  GitHub Discussions
                </h2>
                <Body size="sm" className="text-krds-gray-70">
                  일반적인 질문과 토론을 나눠보세요
                </Body>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-krds-gray-50 group-hover:text-krds-gray-70 transition-colors mt-1"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>

            <a
              href="https://github.com/hanui-o/hanui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 border border-krds-gray-20 rounded-lg hover:border-krds-gray-30 hover:bg-krds-gray-5 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-krds-gray-10 flex items-center justify-center group-hover:bg-krds-gray-20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-krds-gray-70"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="mt-1 mb-3 text-krds-gray-95 font-bold text-lg">
                  GitHub 저장소
                </h2>
                <Body size="sm" className="text-krds-gray-70">
                  소스 코드 확인 및 기여하기
                </Body>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-krds-gray-50 group-hover:text-krds-gray-70 transition-colors mt-1"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>

            <a
              href="https://github.com/hanui-o/hanui/stargazers"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 border border-krds-gray-20 rounded-lg hover:border-krds-gray-30 hover:bg-krds-gray-5 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-krds-gray-10 flex items-center justify-center group-hover:bg-krds-gray-20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-krds-gray-70"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="mt-1 mb-3 text-krds-gray-95 font-bold text-lg">
                  Star 받기
                </h2>
                <Body size="sm" className="text-krds-gray-70">
                  프로젝트에 관심이 있으시다면 Star를 눌러주세요
                </Body>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-krds-gray-50 group-hover:text-krds-gray-70 transition-colors mt-1"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>

            <a
              href="https://velog.io/@hanui/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-4 border border-krds-gray-20 rounded-lg hover:border-krds-gray-30 hover:bg-krds-gray-5 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-krds-gray-10 flex items-center justify-center group-hover:bg-krds-gray-20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-krds-gray-70"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="mt-1 mb-3 text-krds-gray-95 font-bold text-lg">
                  Velog 블로그
                </h2>
                <Body size="sm" className="text-krds-gray-70">
                  HANUI 개발 과정과 팁을 공유합니다
                </Body>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-krds-gray-50 group-hover:text-krds-gray-70 transition-colors mt-1"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>

            <a
              href="mailto:mia@hanui.io"
              className="flex items-start gap-4 p-4 border border-krds-gray-20 rounded-lg hover:border-krds-gray-30 hover:bg-krds-gray-5 transition-colors group"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-md bg-krds-gray-10 flex items-center justify-center group-hover:bg-krds-gray-20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-krds-gray-70"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="mt-1 mb-3 text-krds-gray-95 font-bold text-lg">
                  이메일 연락
                </h2>
                <Body size="sm" className="text-krds-gray-70">
                  직접 연락이 필요한 경우 이메일로 보내주세요
                </Body>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-krds-gray-50 group-hover:text-krds-gray-70 transition-colors mt-1"
              >
                <path d="M7 17L17 7" />
                <path d="M7 7h10v10" />
              </svg>
            </a>
          </div>
        </Stack>
      </PageSection>
    </>
  );
}
