import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    application
    idea

    id("org.springframework.boot") version "2.3.1.RELEASE"
    id("io.spring.dependency-management") version "1.0.9.RELEASE"

    id("com.palantir.docker") version "0.25.0"

    kotlin("jvm") version "1.3.72"
    kotlin("plugin.spring") version "1.3.72"
    kotlin("plugin.jpa") version "1.3.72"
}

group = "agprojects.wiremock"
version = "0.0.1-SNAPSHOT"
java.sourceCompatibility = JavaVersion.VERSION_1_8

val appName = "agprojects.wiremock"
val appVer = "1.0.0"

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    jcenter()
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.data:spring-data-releasetrain:Kay-SR1")
    implementation("org.springframework.boot:spring-boot-starter-data-rest")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("org.springframework.boot:spring-boot-starter-thymeleaf")

    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.security:spring-security-test")

    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")
    implementation("software.amazon.awssdk:dynamodb:2.13.54")
    implementation("com.github.derjust:spring-data-dynamodb:5.1.0")
    implementation("com.google.code.gson:gson:2.8.6")
    runtimeOnly("com.h2database:h2")

    developmentOnly("org.springframework.boot:spring-boot-devtools")
    annotationProcessor("org.springframework.boot:spring-boot-configuration-processor")
    testImplementation("org.springframework.boot:spring-boot-starter-test") {
        exclude(group = "org.junit.vintage", module = "junit-vintage-engine")
    }
    testImplementation("io.projectreactor:reactor-test")
}

springBoot {
    buildInfo {
        properties {
            artifact = "$appName-$appVer.jar"
            version = appVer
            name = appName
        }
    }
}

tasks {

    withType<Test> {
        useJUnitPlatform()
    }

    withType<KotlinCompile> {
        kotlinOptions {
            freeCompilerArgs = listOf("-Xjsr305=strict")
            jvmTarget = "1.8"
        }
    }

    withType(JavaCompile::class).configureEach {
        options.isFork = true
    }

    wrapper {
        gradleVersion = "6.5"
        distributionType = Wrapper.DistributionType.ALL
    }

    bootJar {
        manifest {
            attributes("Multi-Release" to true)
        }

        archiveBaseName.set(appName)
        archiveVersion.set(appVer)

        if (project.hasProperty("archiveName")) {
            archiveFileName.set(project.properties["archiveName"] as String)
        }
    }

    docker {
        val build = build.get()
        val bootJar = bootJar.get()
        val dockerImageName = "${project.group}/$appName"

        dependsOn(build)

        name = "$dockerImageName:latest"
        tag("current", "$dockerImageName:$appVer")
        tag("latest", "$dockerImageName:latest")
        files(bootJar.archiveFile)
        setDockerfile(file("$projectDir/Dockerfile"))
        buildArgs(
                mapOf(
                        "JAR_FILE" to bootJar.archiveFileName.get(),
                        "JAVA_OPTS" to dockerJavaOpts(project)
                )
        )
        pull(true)
    }

    register("stage") {
        dependsOn("build", "clean")
    }

    register<Delete>("cleanOut") {
        delete("out")
    }

    clean {
        dependsOn("cleanOut")
    }

}

fun dockerJavaOpts(project: Project): String {
    val baseOpts = "-XX:-TieredCompilation -XX:MaxRAMPercentage=80"

    if (project.hasProperty("remoteDebug")) {
        project.logger.lifecycle("WARNING: Remote Debugging Enabled!")
        return "$baseOpts -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=*:5005"
    }

    return baseOpts
}
