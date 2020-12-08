package agprojects.wiremock.datasource.repository

import agprojects.wiremock.datasource.entity.StubEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface StubRepository : JpaRepository<StubEntity?, Long?>
