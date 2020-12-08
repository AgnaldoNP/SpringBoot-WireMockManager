package agprojects.wiremock.datasource.entity

import javax.persistence.*

@Entity(name = "StubGroup")
@Table(name = "StubGroup")
class StubGroupEntity(
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        val id: Long = 0,

        @Column
        val name: String = "",

        @Column
        val description: String? = "",

        @Column(name = "`order`")
        val order: Int = 0,

        @OneToMany(
                mappedBy = "stubGroup",
                fetch = FetchType.EAGER,
                orphanRemoval = true
        )
        var stubs: List<StubEntity> = listOf()
)
