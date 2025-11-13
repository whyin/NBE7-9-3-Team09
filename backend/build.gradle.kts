plugins {
    java
    id("org.springframework.boot") version "3.5.6"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("jvm")
}

group = "com"
version = "0.0.1-SNAPSHOT"
description = "backend"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // JPA + Web + Validation (기본)
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // 스프링 시큐리티 (나중에 SecurityConfig 적용할 때)
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("me.paulschwarz:spring-dotenv:4.0.0")

    // JWT
    implementation("io.jsonwebtoken:jjwt-api:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.3")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.3")

    // 롬복
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // 개발 환경용
    developmentOnly("org.springframework.boot:spring-boot-devtools")

    // 데이터베이스 (H2 + MySQL)
    runtimeOnly("com.h2database:h2")
    runtimeOnly("com.mysql:mysql-connector-j")

    // 테스트 관련
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    // 설정 관련
    implementation("me.paulschwarz:spring-dotenv:4.0.0")

    // API 명세 관련
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.9")
    implementation(kotlin("stdlib-jdk8"))
}

tasks.withType<Test> {
    useJUnitPlatform()
}
