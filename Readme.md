# Thatzfit SDK Loader

`thatzfit-loader`는 고객사 웹사이트에서 **Thatzfit Plugin SDK를 안전하게 로드하고 초기화(boot)하는 로더 스크립트**입니다.

이 프로젝트는 [channel-web-sdk-loader](https://github.com/channel-io/channel-web-sdk-loader) 구조를 참고해 구현되었습니다.

## 목적

고객사는 이 로더를 통해 아래를 수행합니다.

- `window.Thatzfit` 글로벌 객체(큐 포함) 초기화
- Thatzfit SDK injector 스크립트 로드
- SDK 준비 전 호출된 명령 큐잉
- 준비 후 `boot`, `shutdown` 같은 명령 전달

즉, 서비스 페이지는 복잡한 SDK 로딩 로직 없이 Thatzfit Plugin을 사용할 수 있습니다.

## 동작 방식

로더 실행 시 다음 순서로 동작합니다.

1. SSR 환경(`window` 없음)인지 검사
2. `window.Thatzfit`가 없으면 임시 함수/큐 생성
3. `DOMContentLoaded` 또는 `load` 시점에 injector 스크립트 1회 로드
4. 이후 `window.Thatzfit("boot", { pluginKey })` 형태 명령을 SDK로 전달

외부 SDK injector URL:

- `https://cdn.thatzfit.com/plugin/ThatzfitSDKInjector.js`

## 고객사 적용 방법

### 1) 로더 스크립트 포함

고객사 페이지에 배포된 로더 파일을 추가합니다.

```html
<script src="https://<your-cdn>/ThatzfitService.js" defer></script>
```

### 2) 플러그인 부트스트랩

페이지 로드 후 `pluginKey`를 전달해 부팅합니다.

```html
<script>
  window.addEventListener("load", function () {
    window.Thatzfit("boot", {
      pluginKey: "YOUR_PLUGIN_KEY",
    });
  });
</script>
```

### 3) 종료 처리(선택)

세션 종료 또는 로그아웃 시 플러그인을 종료할 수 있습니다.

```html
<script>
  window.Thatzfit("shutdown");
</script>
```

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

Vite 라이브러리 빌드 결과물은 `ThatzfitService.js` 이름으로 생성되도록 설정되어 있습니다.

## 인터페이스

현재 로더에서 사용되는 부트 옵션 타입:

```ts
interface BootOption {
  pluginKey: string;
}
```

## 주의사항

- SSR 환경에서는 동작하지 않습니다. 브라우저 환경에서만 사용하세요.
- `pluginKey`는 고객사별 발급 키를 사용해야 합니다.
- 동일 페이지에서 로더가 중복 삽입되지 않도록 관리하세요.

## 개선 사항 및 TODO

- npm 패키지로 배포할 수 있도록 배포 파이프라인 및 버전 정책(semver) 정리
- 고객사 적용 안정성을 위해 단위 테스트/통합 테스트(로더 초기화, 큐 처리, boot/shutdown 호출) 추가

## 라이선스

- 본 프로젝트 라이선스: `LICENSE` (Apache License 2.0)
- 서드파티/참고 출처 고지: `THIRD_PARTY_NOTICES.md`
