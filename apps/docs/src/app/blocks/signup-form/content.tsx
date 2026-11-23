'use client';

import {
  PageSection as Section,
  Heading,
  Subsection,
} from '@/components/content';
import { Installation } from '@/components/content/Installation';
import { FrameworkCodeBlock } from '@/components/content/FrameworkCodeBlock';
import { ComponentPreview } from '@/components/content/ComponentPreview';
import {
  Code,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@hanui/react';
import { SignupForm } from '@hanui/react';

export default function SignupFormPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Signup Form"
        description="이름, 이메일, 비밀번호, 약관동의를 포함한 회원가입 폼 블록. SNS 로그인도 옵션으로 지원합니다."
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="api">API 레퍼런스</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview">
          <Section level="h2">
            <Heading
              level="h2"
              id="overview"
              title="개요"
              className="sr-only"
            />
            <ComponentPreview>
              <SignupForm
                onSubmit={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { SignupForm } from '@/components/hanui/blocks/signup-form'

<SignupForm
  onSubmit={(data) => {
    console.log(data);
    // { name, email, password, passwordConfirm, agreeTerms, agreePrivacy }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="signup-form" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { SignupForm } from '@/components/hanui/blocks/signup-form'

export default function SignupPage() {
  const handleSignup = (data) => {
    // API 호출 등 회원가입 로직
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="sns-login" title="SNS 로그인" />
              <ComponentPreview>
                <SignupForm
                  showSnsLogin
                  snsProviders={['kakao', 'naver', 'google']}
                  onSnsLogin={(provider) => alert(`${provider}로 회원가입`)}
                  onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SignupForm
  showSnsLogin
  snsProviders={['kakao', 'naver', 'google']}
  onSnsLogin={(provider) => handleSnsSignup(provider)}
  onSubmit={handleSignup}
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading
                level="h3"
                id="sns-with-apple"
                title="Apple 로그인 포함"
              />
              <ComponentPreview>
                <SignupForm
                  showSnsLogin
                  snsProviders={['google', 'apple', 'kakao']}
                  onSnsLogin={(provider) => alert(`${provider}로 회원가입`)}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SignupForm
  showSnsLogin
  snsProviders={['google', 'apple', 'kakao']}
  onSnsLogin={(provider) => handleSnsSignup(provider)}
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="stepped" title="스텝 방식 회원가입" />
              <ComponentPreview>
                <SignupForm
                  variant="stepped"
                  onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SignupForm
  variant="stepped"
  onSubmit={handleSignup}
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading
                level="h3"
                id="stepped-sns"
                title="스텝 방식 + SNS 로그인"
              />
              <ComponentPreview>
                <SignupForm
                  variant="stepped"
                  showSnsLogin
                  snsProviders={['kakao', 'google']}
                  onSnsLogin={(provider) => alert(`${provider}로 회원가입`)}
                  onSubmit={(data) => alert(JSON.stringify(data, null, 2))}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SignupForm
  variant="stepped"
  showSnsLogin
  snsProviders={['kakao', 'google']}
  onSnsLogin={(provider) => handleSnsSignup(provider)}
  onSubmit={handleSignup}
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading
                level="h3"
                id="hide-login-link"
                title="로그인 링크 숨기기"
              />
              <ComponentPreview>
                <SignupForm showLoginLink={false} />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SignupForm showLoginLink={false} />`}
              />
            </Subsection>
          </Section>
        </TabsContent>

        {/* API 레퍼런스 탭 */}
        <TabsContent value="api">
          <Section level="h2">
            <Heading level="h2" id="props" title="Props" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Code>onSubmit</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(data) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    폼 제출 핸들러. data에 name, email, password,
                    passwordConfirm, agreeTerms, agreePrivacy 포함
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>className</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>추가 CSS 클래스</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>title</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;회원가입&quot;</Code>
                  </TableCell>
                  <TableCell>카드 제목</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;새 계정을 만들어...&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>showLoginLink</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>true</Code>
                  </TableCell>
                  <TableCell>로그인 링크 표시 여부</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>loginHref</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;/login&quot;</Code>
                  </TableCell>
                  <TableCell>로그인 링크 경로</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>termsHref</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;/terms&quot;</Code>
                  </TableCell>
                  <TableCell>이용약관 링크 경로</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>privacyHref</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;/privacy&quot;</Code>
                  </TableCell>
                  <TableCell>개인정보처리방침 링크 경로</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>showSnsLogin</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>false</Code>
                  </TableCell>
                  <TableCell>SNS 로그인 버튼 표시 여부</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>snsProviders</Code>
                  </TableCell>
                  <TableCell>
                    <Code>SnsProvider[]</Code>
                  </TableCell>
                  <TableCell>
                    <Code>
                      [&apos;kakao&apos;, &apos;naver&apos;, &apos;google&apos;]
                    </Code>
                  </TableCell>
                  <TableCell>
                    SNS 제공자 목록. &apos;kakao&apos; | &apos;naver&apos; |
                    &apos;google&apos; | &apos;apple&apos;
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onSnsLogin</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(provider: SnsProvider) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>SNS 로그인 버튼 클릭 핸들러</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>variant</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&apos;default&apos; | &apos;stepped&apos;</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;default&quot;</Code>
                  </TableCell>
                  <TableCell>
                    폼 변형. stepped 사용 시 3단계(기본 정보 → 비밀번호 → 약관
                    동의) 스텝 방식으로 전환
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
