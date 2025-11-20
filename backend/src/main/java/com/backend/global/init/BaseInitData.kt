package com.backend.global.init

import com.backend.domain.bookmark.entity.Bookmark
import com.backend.domain.bookmark.repository.BookmarkRepository
import com.backend.domain.member.entity.Member
import com.backend.domain.member.entity.Role
import com.backend.domain.member.repository.MemberRepository
import com.backend.domain.place.entity.Place
import com.backend.domain.place.repository.PlaceRepository
import com.backend.domain.place.service.PlaceGeoService
import com.backend.domain.plan.detail.dto.PlanDetailRequestBody
import com.backend.domain.plan.detail.entity.PlanDetail
import com.backend.domain.plan.detail.repository.PlanDetailRepository
import com.backend.domain.plan.entity.Plan
import com.backend.domain.plan.entity.PlanMember
import com.backend.domain.plan.repository.PlanMemberRepository
import com.backend.domain.plan.repository.PlanRepository
import com.backend.domain.review.entity.Review
import com.backend.domain.review.repository.ReviewRepository
import com.backend.domain.review.service.ReviewService
import com.backend.external.seoul.hotel.controller.HotelImportController
import com.backend.external.seoul.modelrestaurant.controller.ModelRestaurantImportController
import com.backend.external.seoul.nightspot.controller.controller.NightSpotImportController
import com.backend.global.exception.BusinessException
import com.backend.global.response.ErrorCode
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.crypto.password.PasswordEncoder
import java.time.LocalDateTime
import java.util.List


@Configuration
class BaseInitData(
    private val memberRepository: MemberRepository,
    private val passwordEncoder: PasswordEncoder,
    private val planRepository: PlanRepository,
    private val planMemberRepository: PlanMemberRepository,
    private val hotelImportController: HotelImportController,
    private val nightSpotImportController: NightSpotImportController,
    private val modelRestaurantImportController: ModelRestaurantImportController,
    private val placeRepository: PlaceRepository,
    private val planDetailRepository: PlanDetailRepository,
    private val placeGeoService: PlaceGeoService,
    private val bookmarkRepository: BookmarkRepository,
    private val reviewRepository: ReviewRepository,
    private val reviewService: ReviewService
    ) {
    private val log = KotlinLogging.logger {}

    @Bean
    fun InitData(): ApplicationRunner {
        return ApplicationRunner { args: ApplicationArguments? ->
            if (memberRepository.count() == 0L) {

                val member1 = Member.createLocal(
                    memberId = "member1",
                    password = passwordEncoder.encode("1111"),
                    email = "member1@gmail.com",
                    nickname = "사용자1",
                )

                val member2 = Member.createLocal(
                    memberId = "member2",
                    password = passwordEncoder.encode("2222"),
                    email = "member2@gmail.com",
                    nickname = "사용자2",
                )

                val member3 = Member.createLocal(
                    memberId = "member3",
                    password = passwordEncoder.encode("3333"),
                    email = "member3@gmail.com",
                    nickname = "사용자3",
                )

                val member4 = Member.createLocal(
                    memberId = "member4",
                    password = passwordEncoder.encode("4444"),
                    email = "member4@gmail.com",
                    nickname = "사용자4",
                )

                val member5 = Member.createLocal(
                    memberId = "member5",
                    password = passwordEncoder.encode("5555"),
                    email = "member5@gmail.com",
                    nickname = "사용자5",
                )

                val member6 = Member.createLocal(
                    memberId = "member6",
                    password = passwordEncoder.encode("6666"),
                    email = "member6@gmail.com",
                    nickname = "사용자6",
                )

                val member7 = Member.createLocal(
                    memberId = "member7",
                    password = passwordEncoder.encode("7777"),
                    email = "member7@gmail.com",
                    nickname = "사용자7",
                )

                val member8 = Member.createLocal(
                    memberId = "member8",
                    password = passwordEncoder.encode("8888"),
                    email = "member8@gmail.com",
                    nickname = "사용자8",
                )

                val admin = Member.createLocal(
                    memberId = "admin",
                    password = passwordEncoder.encode("admin1234"),
                    email = "admin@gmail.com",
                    nickname = "관리자",
                ).apply {
                    role = Role.ADMIN
                }

                memberRepository.saveAll(
                    listOf(
                        member1, member2, member3, member4, member5, member6, member7, member8,
                        admin
                    )
                )
                log.info { "초기 member 데이터 세팅 완료: " }
            }
            if(placeRepository.count() == 0L) {
                hotelImportController.importHotels();
                log.info { "초기 호텔 데이터 세팅 완료 " }

                nightSpotImportController.importNightSpots()
                log.info { "야경명소 Import 완료" }

                modelRestaurantImportController.importAll()
                log.info { "초기 모범음식점 데이터 세팅 완료" }

                val filledCount = placeGeoService.fillAllMissingCoordinates()
                log.info { "초기 Place 좌표 세팅 완료: $filledCount 개" }
            }

            if (planRepository.count() == 0L) {
                val plan1: Plan = Plan(
                    null,
                    memberRepository.getReferenceById(1L),
                    null,
                    null,
                    LocalDateTime.now(),
                    LocalDateTime.now().plusDays(1L),
                    "초기 일정 데이터1",
                    "초기 일정 데이터 내용"
                )


                val plan2: Plan = Plan(
                    null,
                    memberRepository.getReferenceById(2L),
                    null,
                    null,
                    LocalDateTime.now(),
                    LocalDateTime.now().plusDays(1L),
                    "초기 일정 데이터2",
                    "초기 일정 데이터 내용2"
                )

                val plan3: Plan = Plan(
                    null,
                    memberRepository.getReferenceById(1L),
                    null,
                    null,
                    LocalDateTime.now().plusDays(3L),
                    LocalDateTime.now().plusDays(5L),
                    "초기 일정 데이터2",
                    "초기 일정 데이터 내용2"
                )

                planRepository.saveAll(List.of<Plan>(plan1, plan2, plan3))

                val planMember1 = PlanMember(
                    null,
                    memberRepository.getReferenceById(1L),
                    planRepository.getReferenceById(1L)?:throw Exception(),
                    LocalDateTime.now(),
                    LocalDateTime.now(),
                    1
                )

                val planMember2 = PlanMember(
                    null,
                    memberRepository.getReferenceById(2L),
                    planRepository.getReferenceById(2L)?:throw Exception(),
                    LocalDateTime.now(),
                    LocalDateTime.now(),
                    1
                )

                val planMember3 = PlanMember(
                    null,
                    memberRepository.getReferenceById(1L),
                    planRepository.getReferenceById(3L)?:throw Exception(),
                    LocalDateTime.now(),
                    LocalDateTime.now(),
                    1
                )

                val planMember4 = PlanMember(
                    null,
                    memberRepository.getReferenceById(2L),
                    planRepository.getReferenceById(1L)?:throw Exception(),
                    LocalDateTime.now(),
                    LocalDateTime.now(),
                    1
                )


                planMemberRepository.saveAll(List.of<PlanMember>(planMember1, planMember2, planMember3,planMember4))
                log.info("초기 plan 데이터 세팅 완료: ")
            }

            if(planDetailRepository.count() == 0L) {
                var planDetailRequestBody : PlanDetailRequestBody = PlanDetailRequestBody(
                    1L,
                    1L,
                    LocalDateTime.now().plusHours(1),
                    LocalDateTime.now().plusHours(2),
                    "초기 여행 데이터 상세1",
                    "초기 여행 데이터 상세 내용1"
                )

                val planDetail1: PlanDetail = PlanDetail(
                    memberRepository.getReferenceById(1L),
                    planRepository.getReferenceById(1L)?:throw BusinessException(ErrorCode.NOT_FOUND_PLACE),
                    placeRepository.getReferenceById(1L),
                    planDetailRequestBody
                )

                planDetailRepository.save<PlanDetail>(planDetail1)
            }
            val writer1 = memberRepository.findByMemberId("member1")
                ?: throw IllegalStateException("member1이 존재하지 않습니다.")

            val writer2 = memberRepository.findByMemberId("member2")
                ?: throw IllegalStateException("member2이 존재하지 않습니다.")

            if(reviewRepository.count() == 0L) {
                val hotelPlaces = placeRepository.findByCategory_Name("HOTEL")
                val restourantPlaces = placeRepository.findByCategory_Name("맛집")
                val nightSpotPlaces = placeRepository.findByCategory_Name("NIGHTSPOT")
                for (place in hotelPlaces) {
                    // member1 리뷰

                    val rating1 = (((place.id!! - 1) % 5) + 1).toInt()
                    val review1 = Review(
                        place,
                        writer1,
                        rating1,
                        "이곳은 정말 멋진 장소입니다! 별점: " + rating1
                    )
                    review1.onCreate()
                    reviewRepository.save<Review?>(review1)

                    // member2 리뷰
                    val rating2 = (((place.id)!! % 5) + 1).toInt()
                    val review2 = Review(
                        place,
                        writer2,
                        rating2,
                        "여기도 꽤 괜찮네요! 별점: " + rating2
                    )
                    review2.onCreate()
                    reviewRepository.save<Review?>(review2)

                    //                    place.setRatingCount(2);
                    placeRepository.save<Place?>(place)

                    // ⭐ 추천 테이블 업데이트 (베이지안 평균 계산)
                    reviewService.updateRecommend(place)
                }
                for (place in restourantPlaces) {
                    // member1 리뷰

                    val rating1 = (((place.id!! - 1) % 5) + 1).toInt()
                    val review1 = Review(
                        place,
                        writer1,
                        rating1,
                        "이곳은 정말 멋진 장소입니다! 별점: " + rating1
                    )
                    review1.onCreate()
                    reviewRepository.save<Review?>(review1)

                    // member2 리뷰
                    val rating2 = (((place.id)!! % 5) + 1).toInt()
                    val review2 = Review(
                        place,
                        writer2,
                        rating2,
                        "여기도 꽤 괜찮네요! 별점: " + rating2
                    )
                    review2.onCreate()
                    reviewRepository.save<Review?>(review2)

                    //                    place.setRatingCount(2);
                    placeRepository.save<Place?>(place)

                    // ⭐ 추천 테이블 업데이트 (베이지안 평균 계산)
                    reviewService.updateRecommend(place)
                }
                for (place in nightSpotPlaces) {
                    // member1 리뷰

                    val rating1 = (((place.id!! - 1) % 5) + 1).toInt()
                    val review1 = Review(
                        place,
                        writer1,
                        rating1,
                        "이곳은 정말 멋진 장소입니다! 별점: " + rating1
                    )
                    review1.onCreate()
                    reviewRepository.save<Review?>(review1)

                    // member2 리뷰
                    val rating2 = (((place.id)!! % 5) + 1).toInt()
                    val review2 = Review(
                        place,
                        writer2,
                        rating2,
                        "여기도 꽤 괜찮네요! 별점: " + rating2
                    )
                    review2.onCreate()
                    reviewRepository.save<Review?>(review2)

                    //                    place.setRatingCount(2);
                    placeRepository.save<Place?>(place)

                    // ⭐ 추천 테이블 업데이트 (베이지안 평균 계산)
                    reviewService.updateRecommend(place)
//                    reviewService.updateAllRecommend()
                }

            }




            if (bookmarkRepository.count() == 0L) {
                val members = memberRepository.findAll()
                val places = placeRepository.findAll()

                if (members.isNotEmpty() && places.isNotEmpty()) {
                    val bookmarks = mutableListOf<Bookmark>()

                    // 각 멤버마다 3~4개 정도 북마크 생성
                    members.forEach { member ->
                        // 그냥 앞에서 몇 개만 잘라서 사용 (랜덤/의미 필요 없다고 해서 단순하게)
                        val pickedPlaces = places.shuffled().take(4)  // 최대 4개

                        pickedPlaces.forEach { place ->
                            bookmarks += Bookmark.create(member, place)
                        }
                    }

                    bookmarkRepository.saveAll(bookmarks)
                    log.info { "초기 bookmark 데이터 세팅 완료: ${bookmarks.size}개" }
                } else {
                    log.warn { "북마크 초기화 스킵: member 혹은 place 데이터가 없습니다." }
                }
            }

        }
    }
}
