package com.example.demo.controller;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.User;
import com.example.demo.payload.*;
import com.example.demo.repository.BlogRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.UserPrincipal;
import com.example.demo.service.BlogService;
import com.example.demo.security.CurrentUser;
import com.example.demo.util.AppConstants;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {
	 @Autowired
	    private UserRepository userRepository;

	    @Autowired
	    private BlogRepository blogRepository;

	    @Autowired
	    private BlogService blogService;

//	    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

	    @GetMapping("/user/me")
	    @PreAuthorize("hasRole('USER')")
	    public UserSummary getCurrentUser(@CurrentUser UserPrincipal currentUser) {
	        UserSummary userSummary = new UserSummary(currentUser.getId(), currentUser.getUsername(), currentUser.getName());
	        return userSummary;
	    }

	    @GetMapping("/user/checkUsernameAvailability")
	    public UserIdentityAvailability checkUsernameAvailability(@RequestParam(value = "username") String username) {
	        Boolean isAvailable = !userRepository.existsByUsername(username);
	        return new UserIdentityAvailability(isAvailable);
	    }

	    @GetMapping("/user/checkEmailAvailability")
	    public UserIdentityAvailability checkEmailAvailability(@RequestParam(value = "email") String email) {
	        Boolean isAvailable = !userRepository.existsByEmail(email);
	        return new UserIdentityAvailability(isAvailable);
	    }

	    @GetMapping("/users/{username}")
	    public UserProfile getUserProfile(@PathVariable(value = "username") String username) {
	        User user = userRepository.findByUsername(username)
	                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

	        long blogCount = blogRepository.countByCreatedBy(user.getId());

	        UserProfile userProfile = new UserProfile(user.getId(), user.getUsername(), user.getName(), user.getCreatedAt(), blogCount);

	        return userProfile;
	    }

	    @GetMapping("/users/{username}/blogs")
	    public PagedResponse<BlogResponse> getPollsCreatedBy(@PathVariable(value = "username") String username,
	                                                         @CurrentUser UserPrincipal currentUser,
	                                                         @RequestParam(value = "page", defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) int page,
	                                                         @RequestParam(value = "size", defaultValue = AppConstants.DEFAULT_PAGE_SIZE) int size) {
	        return blogService.getBlogsCreatedBy(username, currentUser, page, size);
	    }


	    
}
