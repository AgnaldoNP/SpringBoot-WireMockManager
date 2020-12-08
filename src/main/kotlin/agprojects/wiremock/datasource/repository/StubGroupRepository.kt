package agprojects.wiremock.datasource.repository

import agprojects.wiremock.datasource.entity.StubGroupEntity
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface StubGroupRepository : JpaRepository<StubGroupEntity?, Long?>
