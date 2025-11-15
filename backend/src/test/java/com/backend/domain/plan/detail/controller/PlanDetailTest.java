package com.backend.domain.plan.detail.controller;

import com.backend.domain.member.dto.request.MemberSignupRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
public class PlanDetailTest {
    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("계획 세부 저장 테스트")
    void t1() throws Exception {

        MemberSignupRequest ms = new MemberSignupRequest(
                "dummy",
                "1234",
                "mail@test.com",
                "dummy"
        );

        ResultActions resultActions = mockMvc
                .perform(
                        post("/api/plan/detail/add")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("""
                                        {
                                        "planId" : "1",
                                        "placeId" : "1",
                                        "startTime" : "2020-01-01T00:00:00",
                                        "endTime" : "2020-01-02T00:00:00",
                                        "title" : "세부 작성 테스트용 타이틀",
                                        "content" : "세부 작성 테스트용 콘텐츠"
                                        }
                                        """)

                ).andDo(print());

        resultActions
                .andExpect(status().isOk())
                .andExpect(handler().handlerType(PlanDetailController.class))
                ;
    }

}
