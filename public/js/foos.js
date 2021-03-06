function startup() {
	$(".season-selector").click(select_season);
	load_season_section();
}

function select_season() {
	season_id = $(this).data('season-id');
	current_season_id = season_id;
	current_season_title = $(this).text();
	$("#season-selected").text(current_season_title);
	load_season_section();
}

function load_season_section() {
	$("#content").load('ajax/season/' + current_season_id, on_load_season_section);
	return false;
}

function on_load_season_section() {
	$(".tab1").click(activate_tab1);
	load_summary_subsection();
}

function activate_tab1() {
	division_id = $(this).data('id');

	$(".tab1-element").removeClass("active");
	$("#tab1-division-" + division_id).addClass("active");

	if (division_id == 0) {
		load_summary_subsection();
	} else {
		load_division_subsection(division_id);
	}
}


/* Summary subsection */

function load_summary_subsection() {
	$("#tab1-content").load('ajax/summary/' + current_season_id, on_load_summary_subsection);
}

function on_load_summary_subsection() {
}


/* Division subsection */

function load_division_subsection(division_id) {
	$("#tab1-content").load('ajax/division/' + division_id, on_load_division_subsection);
}

function on_load_division_subsection() {
    $(".player-detail").click(activate_player_detail);
    $("#simulator-modal").on('show.bs.modal', function (event) {
        button = $(event.relatedTarget);
        match_id = button.data('match-id');
        load_simulator_modal(match_id);
    });
}

function activate_player_detail() {
    player_id = $(this).data('player-id');
    element = "#classification-detail-" + player_id;
	$(".classification-detail").hide();
	$("#classification-detail-" + player_id).show();
}


/* Simulator modal */

function load_simulator_modal(match_id) {
	$("#simulator-content").load('ajax/simulator/' + match_id, on_load_simulator_modal);
}

function on_load_simulator_modal() {
	$(".result-selector").click(select_result);
    $("#simulate-submit").click(load_simulation);
}

function select_result() {
	submatch = $(this).data('submatch');
    result_a = $(this).data('result-a');
    result_b = $(this).data('result-b');
	result_txt = result_a + '-' + result_b;
	$("#result-selected-" + submatch).text(result_txt);
	$("#result-selected-" + submatch).data('valid', 1);
	$("#result-selected-" + submatch).data('result-a', result_a);
	$("#result-selected-" + submatch).data('result-b', result_b);
    $("#dropdown-" + submatch).dropdown("toggle");

    if ($("#result-selected-1").data("valid") == 1 &&
        $("#result-selected-2").data("valid") == 1 &&
        $("#result-selected-3").data("valid") == 1) {
        $("#simulate-submit").prop('disabled', false);
	}
    return false;
}

function load_simulation() {
    match_id = $(this).data('match-id');
    post_data = JSON.stringify({
        results: [
          [$("#result-selected-1").data('result-a'), $("#result-selected-1").data('result-b')],
          [$("#result-selected-2").data('result-a'), $("#result-selected-2").data('result-b')],
          [$("#result-selected-3").data('result-a'), $("#result-selected-3").data('result-b')]
        ]
    });
	$.post('ajax/simulation/' + match_id, post_data, on_load_simulation);
}

function on_load_simulation(data, status) {
    $("#simulation-classification-new").html(data);
}

$(document).ready(startup)
